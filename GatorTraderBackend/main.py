'''this is where our backend will be written it is in
the main folder because it makes it easier to serve the react app'''

from flask import Flask, request, jsonify, send_from_directory, Response, url_for
from sanitize import (
    validateEmail,
    validatePassword,
    validateUsername,
    isDuplicate,
    isDuplicateUsername,
    allowed_file
)
from auth import (
    passwordHashedSalted,
    signUp,
    generateJWT,
    isPasswordHashValid,
    checkLoggedInToken
)
from exceptions import (
    DatabaseConnectionError,
    DuplicateError,
    ValidationError,
    AppError,
    InvalidEmailError,
    DuplicateUsernameError,
    InvalidPassword,
    BadUsernameError
)
from flask_cors import CORS
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from operations import setProfileImage, getProfileImage
from sendEmail import (
    generate_email_verification_token,
    storeEmailToken,
    register_verification_route
)
import resend
import base64
import os
import imghdr

load_dotenv()
####DEV REMOVE THIS IN PROD

# Resend setup
resend.api_key = os.environ["RESEND_API_KEY"]
SENDER_ADDRESS = os.environ.get(
    "SENDER_ADDRESS",
    "GatorTrader <no-reply@gatortrader.com>"
)

app = Flask(__name__, static_folder='../GatorTraderFrontend/dist', static_url_path='/')
CORS(app)

register_verification_route(app)

@app.route("/api/signup", methods=["POST", "OPTIONS"])
def signupFunction():
    if request.method == 'OPTIONS':
        return '', 204
    data = request.get_json()
    print("Received data:", data["username"], data["password"],
          data["profile_pic"], data["email"], data["email"])
    email = str(data["email"])
    username = str(data["username"])
    password = str(data["password"])

    try:
        if not validateEmail(email):
            raise InvalidEmailError("Email is invalid")
        if not validatePassword(password):
            raise InvalidPassword("Password Invalid, minimum of 6 characters")
        if isDuplicate(email):
            raise DuplicateError("Email Already in Use")
        if not validateUsername(username) or isDuplicateUsername(username):
            raise DuplicateUsernameError("Username not valid")

        hashed = passwordHashedSalted(password)
        signUp(username, hashed, data["profile_pic"], email)

        # issue token + store
        token = generate_email_verification_token(email)
        storeEmailToken(email, token)

        # send verification link
        verification_url = url_for("verify_email", token=token, _external=True)
        params: resend.Emails.SendParams = {
            "from": SENDER_ADDRESS,
            "to": [email],
            "subject": "Verify your GatorTrader account",
            "html": (
                f"<p>Welcome to GatorTrader!</p>"
                f"<p>Click <a href=\"{verification_url}\">here</a> to verify your email.</p>"
                f"<p>This link expires in 24 hours.</p>"
            ),
        }
        resend.Emails.send(params)

        return jsonify({"message": "Signup successful. A verification email has been sent."}), 200

    except InvalidEmailError as e:
        return jsonify({"message": str(e)}), 400
    except InvalidPassword as e:
        return jsonify({"message": str(e)}), 400
    except DuplicateError as e:
        return jsonify({"message": str(e)}), 400
    except DuplicateUsernameError as e:
        return jsonify({"message": str(e)}), 400
    except AppError as e:
        return jsonify({"message": str(e)}), 500
    except Exception as e:
        # fallback catch-all
        return jsonify({"message": f"Internal Server Error: {e}"}), 500

@app.route("/api/login", methods=["POST", "OPTIONS"])
def loginFunction():
    if request.method == 'OPTIONS':
        return '', 204
    data = request.get_json()
    username = data.get("username", "")
    password = data.get("password", "")

    try:
        if not validateUsername(username) or not isDuplicateUsername(username):
            raise BadUsernameError("Username not valid or is not an account")
        if not validatePassword(password):
            raise InvalidPassword("Invalid Password")

        ok, info = isPasswordHashValid(username, password)
        if not ok:
            raise InvalidPassword("Password Invalid")
        userid, profilePic, uname = info
        expire_ts = int((datetime.utcnow() + timedelta(hours=24))
                        .replace(tzinfo=timezone.utc).timestamp())
        token = generateJWT(userid, uname)
        return jsonify({
            "message": "Login successful",
            "token": token,
            "username": uname,
            "exp": expire_ts
        }), 200

    except (BadUsernameError, InvalidPassword) as e:
        return jsonify({"message": str(e)}), 400
    except AppError as e:
        return jsonify({"message": str(e)}), 500
    except Exception as e:
        return jsonify({"message": f"Internal Server Error: {e}"}), 500

@app.route("/api/profileupdate", methods=["POST"])
@checkLoggedInToken
def updateImage(data):
    try:
        file = request.files.get('image')
        if not file or file.filename == '':
            return jsonify({"error": "No image file provided"}), 400
        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type"}), 400

        success, _ = setProfileImage(file, data['userid'])
        if not success:
            raise AppError("Upload Failed")
        return jsonify({"message": "File uploaded successfully"}), 200

    except DatabaseConnectionError as e:
        return jsonify({"message": f"Database Error: {e}"}), 500
    except AppError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        return jsonify({"message": f"Internal Server Error: {e}"}), 500

@app.route("/api/getProfile", methods=["GET"])
@checkLoggedInToken
def getProfile(data):
    try:
        success, image, mimetype = getProfileImage(data['userid'])
        if not success:
            return jsonify({"error": "Profile image not found"}), 404
        return (bytes(image), 200, {'Content-Type': mimetype})
    except DatabaseConnectionError as e:
        return jsonify({"message": f"Database Error: {e}"}), 500
    except AppError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        return jsonify({"message": f"Internal Server Error: {e}"}), 500

@app.route('/', defaults={'path': ''})
@app.route("/<path:path>")
def catch_all(path):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    app.run(debug=True)
