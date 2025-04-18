'''this is where our backend will be written it is in
the main folder because it makes it easier to serve the react app'''

from flask import Flask, request, jsonify, send_from_directory, Response
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
from sendEmail import (generate_email_verification_token, storeEmailToken, send_verification_email, register_verification_route)

import base64
import os
import imghdr

load_dotenv()
####DEV REMOVE THIS IN PROD

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

app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['SERVER_NAME'] = 'localhost:5000'
app.config['APPLICATION_ROOT'] = '/'
app.config['PREFERRED_URL_SCHEME'] = 'http'

@app.route("/api/signup", methods=["POST", 'OPTIONS'])
def signupFunction():
    if request.method == 'OPTIONS':
        return '', 204
    data = request.get_json()
    # TODO! Add Environment Variable STUFF
    # Print the data for debugging (you can log or store it as needed)
    print("Received data:", data["username"], data["password"],
        data["profile_pic"], data["email"], data["email"])
    # First we validate the username, password and email

    email = str(data["email"])
    username = str(data["username"])
    password = str(data["password"])

    try:

        if email is None or not validateEmail(email):
            print("invalid")
            response_data = {"message": "Invalid Email"}
            raise InvalidEmailError("Email is a invalid")

        if password is None or not validatePassword(password):
            print("invalid")
            response_data = {"message": "Invalid Password"}
            raise InvalidPassword("Password Invalid, minimum of 6 characters")

        if isDuplicate(email):
            print("duplicate Email")
            response_data = {"message": "Cannot use this email, account exists"}
            raise DuplicateError("Email Already in Use")


        if (username is None or not validateUsername(username) or isDuplicateUsername(username)):
            print("invalid")
            response_data = {"message": "Invalid Username"}
            raise DuplicateUsernameError("Username not valid")

        password = passwordHashedSalted(password)

        signUp(username, password, data["profile_pic"],
                email)

        token = generate_email_verification_token(email)
        storeEmailToken(email, token)
        send_verification_email(email, token, mail)


        response_data = {"message": "Signup successful. A verification email has been sent."}
        # Return a response with status code 200
        return jsonify(response_data), 200

    except InvalidEmailError as e:
        response_data = {"message": f"{str(e)}"}
        return jsonify(response_data), 400
    except DuplicateError as e:
        response_data = {"message": f"{str(e)}"}
        return jsonify(response_data), 400
    except DuplicateUsernameError as e:
        response_data = {"message": f"{str(e)}"}
        return jsonify(response_data), 400
    except DatabaseConnectionError as e:
        response_data = {"message": f" Database Error:{str(e)}"}
        return jsonify(response_data), 500
    except AppError as e:
        response_data = {"message": f"{str(e)}"}
        return jsonify(response_data), 400


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
        if (username is None or not validateUsername(username) or not isDuplicateUsername(username)):
            print("username cooked")
            raise DuplicateUsernameError("Username not valid or is not an account")
        
        # We have check if the user has a password, if it meets basic password requirements 
        # and if it is in the database and matches the username. Now to create token 

        if password is None or not validatePassword(password):
            print("password entrycooked")
            response_data = {"message": "Invalid Password"}
            raise InvalidPassword("Password Invalid")
            

        result = isPasswordHashValid(username,password)
        resulter = result[0]
        if resulter == False:
            print("password incorrect")
            raise InvalidPassword("Password Invalid") 
        elif resulter == True:
            userid = result[1][0]
            profilePic = result[1][1]
            username = result[1][2]
            now = datetime.utcnow()
            expireDate = int((now + timedelta(hours=24)).replace(tzinfo=timezone.utc).timestamp())
            token = generateJWT(userid,username)
            response_data = {"message": f"Alr bro here is your token",

            "token":token,"username":username,"exp":expireDate}
            return jsonify(response_data), 200 
    
    except BadUsernameError as e:
        response_data = {"message": f"{str(e)}"}
        return jsonify(response_data), 400
    except InvalidPassword as e:
        response_data = {"message": f" Bad Password:{str(e)}"}
        return jsonify(response_data), 400
    except AppError as e:
        response_data = {"message": f"{str(e)}"}
        return jsonify(response_data), 400 
    except Exception as e:
        # For any other exception
        raise AppError(f"Internal Server Error Contact Admin {str(e)}")

@app.route("/api/profileupdate", methods=["POST"])
@checkLoggedInToken
def updateImage(data):
    try:
        print(data)
        print(data['userid'])
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
            
        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        
        if file and allowed_file(file.filename):
            success,photoBytes = setProfileImage(file,data['userid'])
            if(success):
                print("success time")
                print(photoBytes)
                return jsonify({"message": "File uploaded successfully"}), 200
            else:
                raise AppError("Upload Failed")
                return jsonify({"error": "Invalid file type"}), 400 
        return jsonify({"error": "Invalid file type"}), 400

    except DatabaseConnectionError as e:
        response_data = {"message": f" Database Error:{str(e)}"}
        print(response_data)
        return jsonify(response_data), 500
    except AppError as e:
        response_data = {"message": f"{str(e)}"}
        print(response_data)
        return jsonify(response_data), 400 
    except Exception as e:
        # For any other exception
        print(e)
        raise AppError(f"Internal Server Error Contact Admin {str(e)}")

@app.route("/api/test", methods=["GET"])
@checkLoggedInToken
def test(data):
    print(data)
    return data['username'],200

@app.route("/api/getProfile", methods=["GET"])
@checkLoggedInToken
def getProfile(data):
    try:
        successful, image, mimetype = getProfileImage(data['userid'])
        if successful:
            image_bytes = bytes(image)
            return image_bytes, 200, {'Content-Type': mimetype}  # Adjust content type as needed
        else:
            # Handle the case when image retrieval was unsuccessful
            return {"error": "Profile image not found"}, 404
    except DatabaseConnectionError as e:
        response_data = {"message": f" Database Error:{str(e)}"}
        print(response_data)
        return jsonify(response_data), 500
    except AppError as e:
        response_data = {"message": f"{str(e)}"}
        print(response_data)
        return jsonify(response_data), 400 
    except Exception as e:
        # For any other exception
        print(e)
        raise AppError(f"Internal Server Error Contact Admin {str(e)}")


@app.route('/', defaults={'path': ''})
@app.route("/<string:path>")
@app.route('/<path:path>')
def catch_all(path):
        #return "Your endpoint is /"+path
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == "__main__":
    app.run()
