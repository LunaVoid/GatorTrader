import os
import socket
from dotenv import load_dotenv
from flask import Flask, url_for

import resend
from sendEmail import (
    generate_email_verification_token,
    storeEmailToken,
    register_verification_route,
)

socket.setdefaulttimeout(10)
load_dotenv()

resend.api_key = os.environ.get("RESEND_API_KEY")
SENDER_ADDRESS = "Acme <onboarding@resend.dev>"

app = Flask(__name__)
app.config["SERVER_NAME"] = "localhost:5000"
app.config["PREFERRED_URL_SCHEME"] = "http"
register_verification_route(app)

def test_send_mail():
    test_email = "gatortrader2025@gmail.com"

    token = generate_email_verification_token(test_email)
    print("Token:", token)

    try:
        storeEmailToken(test_email, token)
        print("Token saved in DB")
    except Exception as e:
        print("DB error:", e)
        return

    with app.app_context():
        link = url_for("verify_email", token=token, _external=True)
    print("Verify link:", link)

    params: resend.Emails.SendParams = {
        "from": SENDER_ADDRESS,
        "to": [test_email],
        "subject": "Test: Verify your account",
        "html": (
            "<p>This is a test of the verification flow.</p>"
            f"<p><a href='{link}'>Verify your email</a></p>"
        ),
    }

    try:
        resp = resend.Emails.send(params)
        print("Sent! Response:", resp)
    except Exception as e:
        print("Send error:", e)

if __name__ == "__main__":
    test_send_mail()
