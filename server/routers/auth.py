from fastapi import APIRouter, HTTPException, Depends, status
from passlib.context import CryptContext
from datetime import timedelta, datetime, UTC
import hashlib
import secrets
import os
from database import get_db
from schemas.schemas import (
    UserRegister, UserLogin, UserResponse,
    SignupOTPSend, SignupOTPVerify, SignupOTPResend,
    ForgotPasswordOTPSend, ForgotPasswordOTPVerify, ForgotPasswordReset
)
from utils.email import send_verification_otp_email, send_forgot_password_otp_email

def generate_otp() -> str:
    return f"{secrets.randbelow(900000) + 100000}"

def hash_otp(otp: str, email: str) -> str:
    salt = f"{email.lower().strip()}:{os.getenv('JWT_SECRET', 'prepsprint_secret_key_12345')}"
    return hashlib.sha256((otp + salt).encode('utf-8')).hexdigest()

router = APIRouter(prefix="/api/auth", tags=["auth"])

import bcrypt

def get_password_hash(password: str):
    # Hash the password with a generated salt
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str):
    # Verify the password against the stored hash
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

from datetime import datetime, UTC

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserRegister, db = Depends(get_db)):
    # Check if user exists
    existing_user = await db.users.find_one({
        "$or": [
            {"email": user_data.email},
            {"username": user_data.username}
        ]
    })
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user_dict = {
        "email": user_data.email,
        "username": user_data.username,
        "full_name": user_data.full_name,
        "hashed_password": hashed_password,
        "created_at": datetime.now(UTC)
    }
    
    result = await db.users.insert_one(user_dict)
    user_dict["id"] = str(result.inserted_id)
    
    return user_dict

from utils.auth import create_access_token

@router.post("/login")
async def login(credentials: UserLogin, db = Depends(get_db)):
    # Find user by email
    user = await db.users.find_one({"email": credentials.email})
    
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    token = create_access_token({"sub": str(user["_id"])})
    
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "username": user["username"],
        "full_name": user["full_name"],
        "token": token
    }

# --- Signup OTP Endpoints ---

@router.post("/signup/send-otp")
async def signup_send_otp(user_data: SignupOTPSend, db = Depends(get_db)):
    email_clean = user_data.email.lower().strip()
    username_clean = user_data.username.strip()
    
    if len(user_data.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long"
        )
    
    # Check if email already exists
    existing_email = await db.users.find_one({"email": email_clean})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
        
    # Check if username already exists
    existing_username = await db.users.find_one({"username": username_clean})
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
        
    # Clear any existing pending registrations for this email
    await db.pending_registrations.delete_many({"email": email_clean})
    
    # Generate and hash OTP
    otp = generate_otp()
    otp_hash = hash_otp(otp, email_clean)
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Store pending registration
    pending_record = {
        "email": email_clean,
        "username": username_clean,
        "hashed_password": hashed_password,
        "full_name": user_data.full_name.strip(),
        "otp_hash": otp_hash,
        "expires_at": (datetime.now(UTC) + timedelta(minutes=10)).replace(tzinfo=None),
        "attempts": 0,
        "created_at": datetime.now(UTC).replace(tzinfo=None),
        "last_resend_at": datetime.now(UTC).replace(tzinfo=None)
    }
    
    await db.pending_registrations.insert_one(pending_record)
    
    # Send email
    email_sent = send_verification_otp_email(email_clean, otp)
    if not email_sent:
        # Cleanup if email fails
        await db.pending_registrations.delete_many({"email": email_clean})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send verification email. Please try again later."
        )
        
    return {"message": "Verification OTP sent to your email. Please verify within 10 minutes."}

@router.post("/signup/verify")
async def signup_verify(payload: SignupOTPVerify, db = Depends(get_db)):
    email_clean = payload.email.lower().strip()
    
    pending = await db.pending_registrations.find_one({"email": email_clean})
    if not pending:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No pending registration found. Please sign up again."
        )
        
    # Check if OTP expired
    if datetime.now(UTC).replace(tzinfo=None) > pending["expires_at"]:
        await db.pending_registrations.delete_one({"_id": pending["_id"]})
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired. Please sign up again."
        )
        
    # Check attempts (brute force protection)
    if pending["attempts"] >= 5:
        await db.pending_registrations.delete_one({"_id": pending["_id"]})
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Too many invalid attempts. Pending signup deleted. Please sign up again."
        )
        
    # Verify OTP
    if hash_otp(payload.otp, email_clean) != pending["otp_hash"]:
        new_attempts = pending["attempts"] + 1
        if new_attempts >= 5:
            await db.pending_registrations.delete_one({"_id": pending["_id"]})
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Too many invalid attempts. Pending signup deleted. Please sign up again."
            )
        else:
            await db.pending_registrations.update_one(
                {"_id": pending["_id"]},
                {"$inc": {"attempts": 1}}
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code."
        )
        
    # Check one last time if email/username was registered in the meantime
    existing_user = await db.users.find_one({
        "$or": [
            {"email": pending["email"]},
            {"username": pending["username"]}
        ]
    })
    if existing_user:
        await db.pending_registrations.delete_one({"_id": pending["_id"]})
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already registered"
        )
        
    # Insert new user
    user_dict = {
        "email": pending["email"],
        "username": pending["username"],
        "full_name": pending["full_name"],
        "hashed_password": pending["hashed_password"],
        "created_at": datetime.now(UTC).replace(tzinfo=None)
    }
    
    result = await db.users.insert_one(user_dict)
    user_id = str(result.inserted_id)
    
    # Delete pending registration
    await db.pending_registrations.delete_one({"_id": pending["_id"]})
    
    # Auto-login: generate JWT token
    from utils.auth import create_access_token
    token = create_access_token({"sub": user_id})
    
    return {
        "id": user_id,
        "email": user_dict["email"],
        "username": user_dict["username"],
        "full_name": user_dict["full_name"],
        "token": token
    }

@router.post("/signup/resend-otp")
async def signup_resend_otp(payload: SignupOTPResend, db = Depends(get_db)):
    email_clean = payload.email.lower().strip()
    
    pending = await db.pending_registrations.find_one({"email": email_clean})
    if not pending:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No pending registration found for this email."
        )
        
    # Rate limit check (60-second cooldown)
    last_resend = pending.get("last_resend_at")
    if last_resend:
        now = datetime.now(UTC).replace(tzinfo=None)
        if last_resend.tzinfo is not None:
            last_resend = last_resend.replace(tzinfo=None)
        cooldown_left = 60 - (now - last_resend).total_seconds()
        if cooldown_left > 0:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Please wait {int(cooldown_left)} seconds before requesting a new OTP."
            )
            
    # Generate new OTP
    otp = generate_otp()
    otp_hash = hash_otp(otp, email_clean)
    
    # Update pending record
    await db.pending_registrations.update_one(
        {"_id": pending["_id"]},
        {
            "$set": {
                "otp_hash": otp_hash,
                "expires_at": (datetime.now(UTC) + timedelta(minutes=10)).replace(tzinfo=None),
                "attempts": 0,
                "last_resend_at": datetime.now(UTC).replace(tzinfo=None)
            }
        }
    )
    
    # Send email
    email_sent = send_verification_otp_email(email_clean, otp)
    if not email_sent:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send verification email. Please try again later."
        )
        
    return {"message": "A new verification OTP has been sent to your email."}

from pydantic import BaseModel, EmailStr
from jose import jwt, JWTError
from datetime import datetime, timedelta, UTC
import os

SECRET_KEY = os.getenv("JWT_SECRET", "prepsprint_secret_key_12345")
ALGORITHM = "HS256"

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

def create_reset_token(email: str):
    expire = datetime.now(UTC) + timedelta(minutes=15)
    to_encode = {"sub": email, "purpose": "password_reset", "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_reset_token(token: str) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("purpose") != "password_reset":
            return None
        return payload.get("sub")
    except JWTError:
        return None

@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest, db = Depends(get_db)):
    email_clean = req.email.lower().strip()
    
    user = await db.users.find_one({"email": email_clean})
    if not user:
        raise HTTPException(status_code=404, detail="No account found with this email address")
        
    # Rate limit check (60-second cooldown)
    existing = await db.password_resets.find_one({"email": email_clean})
    if existing:
        last_resend = existing.get("last_resend_at")
        if last_resend:
            now = datetime.now(UTC).replace(tzinfo=None)
            if last_resend.tzinfo is not None:
                last_resend = last_resend.replace(tzinfo=None)
            cooldown_left = 60 - (now - last_resend).total_seconds()
            if cooldown_left > 0:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Please wait {int(cooldown_left)} seconds before requesting a new OTP."
                )
                
    # Invalidate any previous forgot password OTPs
    await db.password_resets.delete_many({"email": email_clean})
    
    # Generate and hash OTP
    otp = generate_otp()
    otp_hash = hash_otp(otp, email_clean)
    
    # Store reset request details
    reset_record = {
        "email": email_clean,
        "otp_hash": otp_hash,
        "expires_at": (datetime.now(UTC) + timedelta(minutes=10)).replace(tzinfo=None),
        "attempts": 0,
        "created_at": datetime.now(UTC).replace(tzinfo=None),
        "last_resend_at": datetime.now(UTC).replace(tzinfo=None)
    }
    
    await db.password_resets.insert_one(reset_record)
    
    # Send email
    email_sent = send_forgot_password_otp_email(email_clean, otp)
    if not email_sent:
        await db.password_resets.delete_many({"email": email_clean})
        raise HTTPException(
            status_code=500,
            detail="Failed to send password reset OTP. Please try again later."
        )
        
    return {"message": "Password reset OTP sent to your email. Please verify within 10 minutes."}

@router.post("/forgot-password/verify-otp")
async def verify_forgot_password_otp(payload: ForgotPasswordOTPVerify, db = Depends(get_db)):
    email_clean = payload.email.lower().strip()
    
    reset = await db.password_resets.find_one({"email": email_clean})
    if not reset:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No password reset request found for this email."
        )
        
    # Check expiry
    if datetime.now(UTC).replace(tzinfo=None) > reset["expires_at"]:
        await db.password_resets.delete_one({"_id": reset["_id"]})
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired. Please request a new one."
        )
        
    # Check attempts (brute force protection)
    if reset["attempts"] >= 5:
        await db.password_resets.delete_one({"_id": reset["_id"]})
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Too many invalid attempts. Please request a new OTP."
        )
        
    # Verify OTP
    if hash_otp(payload.otp, email_clean) != reset["otp_hash"]:
        new_attempts = reset["attempts"] + 1
        if new_attempts >= 5:
            await db.password_resets.delete_one({"_id": reset["_id"]})
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Too many invalid attempts. Please request a new OTP."
            )
        else:
            await db.password_resets.update_one(
                {"_id": reset["_id"]},
                {"$inc": {"attempts": 1}}
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code."
        )
        
    # Generate short-lived reset token (10 minutes)
    token = create_reset_token(email_clean)
    
    # Delete OTP record to prevent reuse
    await db.password_resets.delete_one({"_id": reset["_id"]})
    
    return {
        "token": token,
        "message": "OTP verified successfully. You may now reset your password."
    }

@router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest, db = Depends(get_db)):
    email = verify_reset_token(req.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
        
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if len(req.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long"
        )
        
    hashed_password = get_password_hash(req.new_password)
    await db.users.update_one(
        {"email": email},
        {"$set": {"hashed_password": hashed_password}}
    )
    return {"message": "Password reset successfully"}


