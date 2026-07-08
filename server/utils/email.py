import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

def send_reset_email(to_email: str, reset_link: str):
    msg = MIMEMultipart()
    msg['From'] = SMTP_USER
    msg['To'] = to_email
    msg['Subject'] = "Reset Your PrepSprint Password"
    
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
    
    msg.attach(MIMEText(body, 'html'))
    
    try:
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        text = msg.as_string()
        server.sendmail(SMTP_USER, to_email, text)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
