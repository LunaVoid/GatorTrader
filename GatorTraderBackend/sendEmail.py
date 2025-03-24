import jwt 
from datetime import datetime, timedelta
import os
from flask import url_for, jsonify, current_app
from flask_mail import Message
from creds import get_db_connection
from exceptions import DatabaseConnectionError, AppError

# Generate JWT token for email verification
def generate_email_verification_token(email):
  now = datetime.utcnow()
  exp = now + timedelta(hours=24)
  payload = {
    'email': email,
    'iat': now, 
    'exp': exp
  }
  token = jwt.encode(payload, os.environ['TOPSECRET'], algorithm="HS256")
  return token

# Store the generated email token and its expiration in the database. 
def storeEmailToken(email, token):
  token_expires = datetime.utcnow() + timedelta(hours=24)
  try:
    with get_db_connection() as conn:
      with conn.cursor() as cur:
        cur.execute(
          "UPDATE users SET email_token = %s, token_expires = %s WHERE email = %s",
          (token, token_expires, email)
        )
        conn.commit()
  except Exception as e:
    raise AppError(f"Error storing email token: {e}")

# Send a verification email to the user using Flask-Mail.
def send_verification_email(email, token, mail):
  verification_url =url_for('verify_email', token=token, _external=True)
  msg = Message(
    "Verify Your Email",
    sender="shunmukavalsa@gmail.com",
    recipients = [email]
  )
  msg.body = f"Please verify your email by clicking the following link: {verification_url}"
  mail.send(msg)

def register_verification_route(app):
  @app.route("/api/verify/<token>", methods=["GET"])
  def verify_email(token):
    try:
      payload = jwt.decode(token, os.environ['TOPSECRET'], algorithms=["HS256"])
      email = payload.get('email')
    except jwt.ExpiredSignatureError:
      return jsonify({"message": "Verification token expired."}), 400
    except jwt.InvalidTokenError:
      return jsonify({"message": "Invalid verification token."}), 400
    
    try:
      with get_db_connection() as conn:
        with conn.cursor() as cur:
          cur.execute(
            "UPDATE users SET email_verified = TRUE, email_token = NULL WHERE email = %s", 
            (email,)
          )
          conn.commit()
      return jsonify({"message": "Email verified successfully."}), 200
    except Exception as e:
      return jsonify({"message": f"Error verifying email: {e}"}), 500
    
def isEmailVerified(email):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT email_verified FROM users WHERE email = %s", (email,))
                row = cur.fetchone()
                if row:
                    return row[0]
                return False
    except Exception as e:
        raise AppError(f"Error checking email verification: {e}")
