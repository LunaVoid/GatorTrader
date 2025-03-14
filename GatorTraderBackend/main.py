'''this is where our backend will be written it is in
the main folder because it makes it easier to serve the react app'''

from flask import Flask, request, jsonify, send_from_directory, Response
from sanitize import (validateEmail, validatePassword,
                          validateUsername, isDuplicate, isDuplicateUsername)
from auth import passwordHashedSalted, signUp, generateJWT,isPasswordHashValid, checkLoggedInToken
from exceptions import (DatabaseConnectionError, DuplicateError, ValidationError, AppError
                        , InvalidEmailError, DuplicateUsernameError, InvalidPassword, BadUsernameError)
from flask_cors import CORS
####DEV REMOVE THIS IN PROD

app = Flask(__name__, static_folder='../GatorTraderFrontend/dist', static_url_path='/')
CORS(app, origins=['http://localhost:5173','http://127.0.0.1:5000'])
#CORS(app)

#@app.before_request
#def basic_authentication():
#    if request.method.lower() == 'options':
#        return Response()

@app.route("/api/signup", methods=["POST", "OPTIONS"])
def signupFunction():
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
            raise InvalidEmailError("Email is a duplicate")

        if password is None or not validatePassword(password):
            print("invalid")
            response_data = {"message": "Invalid Password"}
            raise InvalidPassword("Password Invalid")

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


@app.route("/api/login", methods=["POST"])
def loginFunction():
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
            username = result[1][1]
            token = generateJWT(userid,username)
            response_data = {"message": f"Alr bro here is your token",
            "token":token,"username":username}
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
        raise AppError("Internal Server Error Contact Admin or Navigate Back to Main Page")

@app.route("/api/test", methods=["GET"])
@checkLoggedInToken
def test(data):
    print(data)
    return data['username'],200

@app.route("/api/private", methods=["GET"])
@checkLoggedInToken
def tester(data):
    print(data)
    return "Private Data",200

@app.route('/', defaults={'path': ''})
@app.route("/<string:path>")
@app.route('/<path:path>')
def catch_all(path):
        #return "Your endpoint is /"+path
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == "__main__":
    app.run()
