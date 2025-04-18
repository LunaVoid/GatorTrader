'''this is where our backend will be written it is in
the main folder because it makes it easier to serve the react app'''

from flask import Flask, request, jsonify, send_from_directory, Response, url_for
from sanitize import (validateEmail, validatePassword,
                          validateUsername, isDuplicate, isDuplicateUsername, allowed_file)
from auth import passwordHashedSalted, signUp, generateJWT,isPasswordHashValid, checkLoggedInToken
from exceptions import (DatabaseConnectionError, DuplicateError, ValidationError, AppError
                        , InvalidEmailError, DuplicateUsernameError, InvalidPassword, BadUsernameError)
from flask_cors import CORS
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from operations import setProfileImage, getProfileImage
from sendEmail import (generate_email_verification_token, storeEmailToken, register_verification_route)
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
#CORS(app, origins=['http://localhost:5173','http://127.0.0.1:5000'])
#CORS(app)
#CORS(app, origin = "*")
#CORS(app, resources={r"/api/*": {"origins": "*"}})

'''
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://localhost:5000", "http://127.0.0.1:5000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
'''

CORS(app, add_default_headers={
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
})

#@app.before_request
#def basic_authentication():
#    if request.method.lower() == 'options':
#        return Response()

register_verification_route(app)

@app.route("/api/signup", methods=["POST", 'OPTIONS'])
def signupFunction():
    if request.method == 'OPTIONS':
        return '', 204
    data = request.get_json()
    print("Received data:", data["username"], data["password"],
        data["profile_pic"], data["email"], data["email"] )

    email = str(data["email"])
    username = str(data["username"])
    password = str(data["password"])

    try:
        if email is None or not validateEmail(email):
            raise InvalidEmailError("Email is a invalid")

        if password is None or not validatePassword(password):
            raise InvalidPassword("Password Invalid, minimum of 6 characters")

        if isDuplicate(email):
            raise DuplicateError("Email Already in Use")

        if username is None or not validateUsername(username) or isDuplicateUsername(username):
            raise DuplicateUsernameError("Username not valid")

        password = passwordHashedSalted(password)

        signUp(username, password, data["profile_pic"], email)

        token = generate_email_verification_token(email)
        storeEmailToken(email, token)

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

        return jsonify({
            "message": "Signup successful. A verification email has been sent."
        }), 200

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
        raise AppError(f"Internal Server Error: {e}")

@app.route("/api/login", methods=["POST", 'OPTIONS'])
def loginFunction():
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        response_data = {"message": "test"}
        print("Received data:", data["username"], data["password"])
        username = data["username"]
        password = data['password']
        if username is None or not validateUsername(username) or not isDuplicateUsername(username):
            raise DuplicateUsernameError("Username not valid or is not an account")

        if password is None or not validatePassword(password):
            raise InvalidPassword("Password Invalid")

        result = isPasswordHashValid(username,password)
        resulter = result[0]
        if not resulter:
            raise InvalidPassword("Password Invalid")
        userid, profilePic, uname = result[1]
        now = datetime.utcnow()
        expireDate = int((now + timedelta(hours=24)).replace(tzinfo=timezone.utc).timestamp())
        token = generateJWT(userid,uname)
        response_data = {"message": "Alr bro here is your token", "token": token, "username": uname, "exp": expireDate}
        return jsonify(response_data), 200

    except BadUsernameError as e:
        return jsonify({"message": str(e)}), 400
    except InvalidPassword as e:
        return jsonify({"message": f" Bad Password:{str(e)}"}), 400
    except AppError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        raise AppError(f"Internal Server Error Contact Admin {str(e)}")

@app.route("/api/profileupdate", methods=["POST"])
@checkLoggedInToken
def updateImage(data):
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        if file and allowed_file(file.filename):
            success,photoBytes = setProfileImage(file,data['userid'])
            if success:
                return jsonify({"message": "File uploaded successfully"}), 200
            else:
                raise AppError("Upload Failed")
        return jsonify({"error": "Invalid file type"}), 400

    except DatabaseConnectionError as e:
        return jsonify({"message": f" Database Error:{str(e)}"}), 500
    except AppError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        raise AppError(f"Internal Server Error Contact Admin {str(e)}")

@app.route("/api/test", methods=["GET"])
@checkLoggedInToken
def test(data):
    return data['username'],200

@app.route("/api/getProfile", methods=["GET"])
@checkLoggedInToken
def getProfile(data):
    try:
        successful, image, mimetype = getProfileImage(data['userid'])
        if successful:
            return bytes(image), 200, {'Content-Type': mimetype}
        return {"error": "Profile image not found"}, 404
    except DatabaseConnectionError as e:
        return jsonify({"message": f" Database Error:{str(e)}"}), 500
    except AppError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        raise AppError(f"Internal Server Error Contact Admin {str(e)}")

@app.route('/', defaults={'path': ''})
@app.route("/<string:path>")
@app.route('/<path:path>')
def catch_all(path):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    app.run()
