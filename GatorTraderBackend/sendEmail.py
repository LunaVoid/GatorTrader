from flask_mail import Message
from flask import current_app
import jwt
from datetime import datetime, timedelta
import os

def generate_email_token(email):
    payload = {
        'email': email,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, os.environ['TOPSECRET'], algorithm='HS256')

def send_verification_email(mail, user_email):
    token = generate_email_token(user_email)
    link = f"http://localhost:5173/verify?token={token}"

    msg = Message(
        subject="Verify Your Email",
        sender=current_app.config['MAIL_USERNAME'],
        recipients=[user_email],
        body=f"Welcome to GatorTrader!\n\nClick here to verify your account:\n{link}"
    )
    mail.send(msg)

def send_reset_email(mail, user_email):
    token = generate_email_token(user_email)
    link = f"http://localhost:5173/reset-password?token={token}"

    msg = Message(
        subject="Reset Your GatorTrader Password",
        sender=current_app.config['MAIL_USERNAME'],
        recipients=[user_email],
        body=f"You requested a password reset.\nClick here to reset:\n{link}"
    )
    mail.send(msg)
