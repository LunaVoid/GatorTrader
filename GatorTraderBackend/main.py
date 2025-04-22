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
from operations import setProfileImage, getProfileImage, setLevel, getLevel, setFavs, deleteFavs, getFavs, setEmail

import base64
import os
import imghdr

from apscheduler.schedulers.background import BackgroundScheduler
import dailyUpdate

from flask_mail import Mail
from sendEmail import send_verification_email, send_reset_email
from flask import request
from operations import get_db_connection
import jwt

load_dotenv()
####DEV REMOVE THIS IN PROD

app = Flask(__name__, static_folder='../GatorTraderFrontend/dist', static_url_path='/')
# CORS(app, origins=['http://localhost:5173','http://127.0.0.1:5000'])

app.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USERNAME=os.getenv('MAIL_USERNAME'),
    MAIL_PASSWORD=os.getenv('MAIL_PASSWORD')
)
mail = Mail(app)


# CORS(app, origin = "*")
# CORS(app, resources={r"/api/*": {"origins": "*"}})
CORS(app)
'''
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://localhost:5000", "http://127.0.0.1:5000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
'''

'''
CORS(app, add_default_headers={
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
})
'''
#@app.before_request
#def basic_authentication():
#    if request.method.lower() == 'options':
#        return Response()

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
        send_verification_email(mail, email)
        response_data = {"message": "Signup successful"}

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

#change email
@app.route("/api/changeemail", methods=['POST', 'OPTIONS'])
@checkLoggedInToken
def changeEmail(data):
    try:
        print(data)
        requestData = request.get_json()
        email = requestData["email"]
        if isDuplicate(email):
            print("duplicate Email")
            response_data = {"message": "Cannot use this email, account exists"}
            raise DuplicateError("Email Already in Use")
        if email is None or not validateEmail(email):
            print("invalid")
            response_data = {"message": "Invalid Email"}
            raise InvalidEmailError("Email is a invalid")
        else:
            print("Changing Email")
            setEmail(email,data["username"])


        #response_data = {"message": "Email Change successful"}
        return jsonify(True), 200

    except InvalidEmailError as e:
        response_data = {"message": f"{str(e)}"}
        return jsonify(response_data), 400
    except DuplicateError as e:
        response_data = {"message": f"{str(e)}"}
        return jsonify(response_data), 400
    except AppError as e:
        response_data = {"message": f"{str(e)}"}
        return jsonify(response_data), 400 
    except Exception as e:
        # For any other exception
        raise AppError(f"Internal Server Error Contact Admin {str(e)}")

@app.route("/api/changeLevel", methods=["POST"])
@checkLoggedInToken
def changeLevel(data):
    try:
        print(data)
        print(data['userid'])
        requestData = request.get_json()
        level = requestData["level"]
        print(level)
        if level != "beginner" and level != "intermediate" and level != "advanced":
            raise AppError(f"No level selected")
        setLevel(level, data["userid"])
        return jsonify({"message": "Yippee"}), 200

    except AppError as e:
        response_data = {"message": f"{str(e)}"}
        print(response_data)
        return jsonify(response_data), 400 
    except Exception as e:
        # For any other exception
        print(e)
        raise AppError(f"Internal Server Error Contact Admin {str(e)}")
    
@app.route("/api/getLevel", methods=["GET"])
@checkLoggedInToken
def retrieveLevel(data):
    try:
        print(data)
        print(data['userid'])
        levelTuple = getLevel(data['userid'])
        if levelTuple[0]:
            response_data = {"level": levelTuple[1]}
            return jsonify(response_data), 200 
        else:
            raise AppError(f"Your level didn't work {str(e)}")

    except AppError as e:
        response_data = {"message": f"{str(e)}"}
        print(response_data)
        return jsonify(response_data), 400 
    except Exception as e:
        # For any other exception
        print(e)
        raise AppError(f"Internal Server Error Contact Admin {str(e)}")

@app.route("/api/setfavs", methods=["POST"])
@checkLoggedInToken
def setFavoriteStocks(data):
    try:
        print(data)
        requestData = request.get_json()
        print(requestData['favStocks'])
        stocks = requestData["favStocks"]
        if not isinstance(stocks, list):
            raise AppError(f"Not an Array")
        deleteFavs(data['userid'])
        count, insertedStocks = setFavs(stocks,data['userid'])
        return jsonify({"message": f"Yippee stocks: ${insertedStocks}"}), 200

    except AppError as e:
        response_data = {"message": f"{str(e)}"}
        print(response_data)
        return jsonify(response_data), 400 
    except Exception as e:
        # For any other exception
        print(e)
        raise AppError(f"Internal Server Error Contact Admin {str(e)}")

@app.route("/api/getfavs", methods=["GET"])
@checkLoggedInToken
def getFavoriteStocks(data):
    try:
        userStocks = getFavs(data['userid'])
        return jsonify({
            "message": f"Yippee stocks: {userStocks}", 
            "stocks": userStocks
        }), 200
    except AppError as e:
        response_data = {"message": f"{str(e)}"}
        print(response_data)
        return jsonify(response_data), 400 
    except Exception as e:
        # For any other exception
        print(e)
        raise AppError(f"Internal Server Error Contact Admin {str(e)}")
    

@app.route("/api/verify", methods=["GET"])
def verify_email():
    token = request.args.get("token")
    try:
        print("Received token:", token)
        decoded = jwt.decode(token, os.environ['TOPSECRET'], algorithms=["HS256"])
        email = decoded['email']
        print("Decoded email:", email)

        from creds import get_db_connection
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("UPDATE users SET email_verified = TRUE WHERE email = %s", (email,))
                conn.commit()

        return jsonify({"message": "Email verified successfully!"}), 200

    except jwt.ExpiredSignatureError:
        print("Token expired")
        return jsonify({"error": "Token expired"}), 400
    except jwt.InvalidTokenError:
        print("Invalid token")
        return jsonify({"error": "Invalid token"}), 400
    except Exception as e:
        print("Unexpected error:", e)  # ← this line helps you debug
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
    

@app.route("/api/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")

    if not email or not validateEmail(email):
        return jsonify({"message": "Invalid email"}), 400

    if not isDuplicate(email):  # means user doesn't exist
        return jsonify({"message": "Email not found"}), 404

    try:
        print("Sending reset email to:", email)
        send_reset_email(mail, email)
        return jsonify({"message": "Reset email sent!"}), 200
    except Exception as e:
        print("Error sending reset email:", e)  # <-- this will show the real issue
        return jsonify({"message": "Failed to send reset email"}), 500




@app.route("/api/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    token = data.get("token")
    new_password = data.get("new_password")

    if not token or not new_password or not validatePassword(new_password):
        return jsonify({"message": "Invalid input"}), 400

    try:
        decoded = jwt.decode(token, os.environ['TOPSECRET'], algorithms=["HS256"])
        email = decoded['email']

        # Hash and update new password
        hashed_pw = passwordHashedSalted(new_password)

        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("UPDATE users SET password = %s WHERE email = %s", (hashed_pw, email))
                conn.commit()

        return jsonify({"message": "Password reset successful!"}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 400
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 400
    except Exception as e:
        print("Reset error:", e)
        return jsonify({"message": "Something went wrong"}), 500

@app.route("/api/test-reset-token")
def test_reset_token():
    from sendEmail import generate_email_token
    return generate_email_token("hiralshukla@ufl.edu")



# Route to serve any files in the static folder
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

# Explicit route for favicon (if placed in static folder)
@app.route('/realFavicon.png')
def serve_favicon():
    return send_from_directory(app.static_folder, 'realFavicon.png')

@app.route('/', defaults={'path': ''})
@app.route("/<string:path>")
@app.route('/<path:path>')
def catch_all(path):
        #return "Your endpoint is /"+path
        return send_from_directory(app.static_folder, 'index.html')

scheduler = BackgroundScheduler()
scheduler.add_job(
    dailyUpdate.updateData,
    'cron',
    day_of_week='mon-fri',
    hour=19,
    minute=5,
    timezone='US/Eastern'
)
scheduler.start()

if __name__ == "__main__":
    app.run()
