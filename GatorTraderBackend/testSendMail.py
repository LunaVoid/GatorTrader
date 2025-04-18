import os
import socket
from dotenv import load_dotenv
from flask import Flask
from flask_mail import Mail
from sendEmail import generate_email_verification_token, storeEmailToken, send_verification_email, register_verification_route

socket.setdefaulttimeout(10) 
load_dotenv()

app = Flask(__name__)
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')

app.config['SERVER_NAME'] = 'localhost:5000'
app.config['APPLICATION_ROOT'] = '/'
app.config['PREFERRED_URL_SCHEME'] = 'http'



mail = Mail(app)
register_verification_route(app)


def test_send_mail():
    test_email = os.environ.get('TEST_EMAIL', app.config['MAIL_USERNAME'])
    if not test_email:
        print("error")
        return

    token = generate_email_verification_token(test_email)
    print("token: ", token)

    try:
        storeEmailToken(test_email, token)
        print("success")
    except Exception as e:
        print("error", e)

    with app.app_context():
        try:
            send_verification_email(test_email, token, mail)
            print("Success")
        except Exception as e:
            print("Error: ", e)

if __name__ == '__main__':
    test_send_mail()
