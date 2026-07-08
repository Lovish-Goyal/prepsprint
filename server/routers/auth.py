from fastapi import APIRouter, HTTPException, Depends, status
from passlib.context import CryptContext
from datetime import timedelta
from database import get_db
from schemas.schemas import UserRegister, UserLogin, UserResponse

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
    user = await db.users.find_one({"email": req.email})
    if not user:
        raise HTTPException(status_code=404, detail="No account found with this email address")
    
    token = create_reset_token(req.email)
    reset_link = f"http://localhost:3000/auth/reset-password?token={token}"
    
    from utils.email import send_reset_email
    success = send_reset_email(req.email, reset_link)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send password reset email. Please try again later.")
        
    return {"message": "Password reset link sent to your email"}

@router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest, db = Depends(get_db)):
    email = verify_reset_token(req.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
        
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    hashed_password = get_password_hash(req.new_password)
    await db.users.update_one(
        {"email": email},
        {"$set": {"hashed_password": hashed_password}}
    )
    return {"message": "Password reset successfully"}


