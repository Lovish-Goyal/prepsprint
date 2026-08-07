import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("EMAIL_USER") or os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("EMAIL_APP_PASSWORD") or os.getenv("SMTP_PASSWORD")

def send_email(to_email: str, subject: str, html_body: str) -> bool:
    if not SMTP_USER or not SMTP_PASSWORD:
        print("SMTP credentials are not configured.")
        return False

    msg = MIMEMultipart()
    msg['From'] = f"PrepSprint <{SMTP_USER}>"
    msg['To'] = to_email
    msg['Subject'] = subject
    
    msg.attach(MIMEText(html_body, 'html'))
    
    try:
        if SMTP_PORT == 465:
            server = smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=10.0)
        else:
            server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10.0)
            if SMTP_PORT == 587:
                server.starttls()
        
        server.login(SMTP_USER, SMTP_PASSWORD)
        text = msg.as_string()
        server.sendmail(SMTP_USER, to_email, text)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
        return False

def send_verification_otp_email(to_email: str, otp: str) -> bool:
    subject = "Verify Your PrepSprint Account"
    body = f"""
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 30px auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
      <div style="text-align: center; margin-bottom: 25px;">
        <span style="background-color: #2563eb; color: #ffffff; padding: 10px 20px; font-size: 20px; font-weight: 800; border-radius: 12px; letter-spacing: 0.5px; display: inline-block;">PrepSprint</span>
      </div>
      <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-bottom: 12px; text-align: center;">Verify Your Email Address</h2>
      <p style="color: #475569; font-size: 15px; line-height: 1.6; text-align: center; margin-bottom: 24px;">Thank you for signing up for PrepSprint! To complete your registration, please verify your email address using the secure code below:</p>
      
      <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
        <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; color: #2563eb; letter-spacing: 6px; display: inline-block; padding: 5px 10px;">{otp}</span>
        <p style="color: #64748b; font-size: 12px; margin-top: 10px; margin-bottom: 0;">This OTP is valid for <strong>10 minutes</strong>.</p>
      </div>

      <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 6px; margin-bottom: 24px;">
        <p style="color: #b45309; font-size: 13px; margin: 0; line-height: 1.5;"><strong>Security Notice:</strong> For security reasons, do not share this verification code with anyone. PrepSprint support will never ask for this code.</p>
      </div>

      <p style="color: #64748b; font-size: 13px; text-align: center;">If you did not request this verification, you can safely ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 25px 0;" />
      <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">&copy; 2026 PrepSprint Career Accelerator. All rights reserved.</p>
    </div>
    """
    return send_email(to_email, subject, body)

def send_forgot_password_otp_email(to_email: str, otp: str) -> bool:
    subject = "Reset Your PrepSprint Password"
    body = f"""
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 30px auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
      <div style="text-align: center; margin-bottom: 25px;">
        <span style="background-color: #2563eb; color: #ffffff; padding: 10px 20px; font-size: 20px; font-weight: 800; border-radius: 12px; letter-spacing: 0.5px; display: inline-block;">PrepSprint</span>
      </div>
      <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-bottom: 12px; text-align: center;">Password Reset Verification</h2>
      <p style="color: #475569; font-size: 15px; line-height: 1.6; text-align: center; margin-bottom: 24px;">We received a request to reset the password for your PrepSprint account. Use the secure code below to verify your identity:</p>
      
      <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
        <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; color: #2563eb; letter-spacing: 6px; display: inline-block; padding: 5px 10px;">{otp}</span>
        <p style="color: #64748b; font-size: 12px; margin-top: 10px; margin-bottom: 0;">This OTP is valid for <strong>10 minutes</strong>.</p>
      </div>

      <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 6px; margin-bottom: 24px;">
        <p style="color: #b45309; font-size: 13px; margin: 0; line-height: 1.5;"><strong>Security Notice:</strong> For security reasons, do not share this verification code with anyone. PrepSprint support will never ask for this code.</p>
      </div>

      <p style="color: #64748b; font-size: 13px; text-align: center;">If you did not request a password reset, you can safely ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 25px 0;" />
      <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">&copy; 2026 PrepSprint Career Accelerator. All rights reserved.</p>
    </div>
    """
    return send_email(to_email, subject, body)

def send_reset_email(to_email: str, reset_link: str):
    # Legacy link-based method, kept for backward compatibility
    body = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #1e1b4b; margin-bottom: 20px;">Reset Your Password</h2>
      <p style="color: #475569; font-size: 16px; line-height: 1.6;">Hi,</p>
      <p style="color: #475569; font-size: 16px; line-height: 1.6;">We received a request to reset your password for your PrepSprint account.</p>
      <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">Click the button below to set a new password. This link is valid for 15 minutes:</p>
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="{reset_link}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #64748b; font-size: 14px;">If you didn't request this change, you can safely ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
      <p style="color: #94a3b8; font-size: 12px;">PrepSprint Team<br/>Lovish Goyal</p>
    </div>
    """
    return send_email(to_email, "Reset Your PrepSprint Password", body)

