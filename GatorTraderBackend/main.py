'''this is where our backend will be written it is in
the main folder because it makes it easier to serve the react app'''

from flask import Flask, request, jsonify
from sanitize import (validateEmail, validatePassword,
                          validateUsername, isDuplicate, isDuplicateUsername)
from encryption import passwordHashedSalted, signUp, generateJWT,isPasswordHashValid
from exceptions import (DatabaseConnectionError, DuplicateError, ValidationError, AppError
                        , InvalidEmailError, DuplicateUsernameError, InvalidPassword)

app = Flask(__name__, static_folder='../GatorTraderFrontend/dist', static_url_path='/')


@app.route("/")
def serveReact():
    print("Sending home page")
    return app.send_static_file('index.html')


@app.route("/signup", methods=["POST"])
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


@app.route("/login", methods=["POST"])
def loginFunction():
    data = request.get_json()
    response_data = {"message": "test"}
    print("Received data:", data["username"], data["password"])
    username = data["username"]
    password = data['password']
    if (username is None or not validateUsername(username) or not isDuplicateUsername(username)):
        print("username cooked")
        raise DuplicateUsernameError("Username not valid or is not an account")
    if password is None or not validatePassword(password) or not isPasswordHashValid(username,password):
        print("password entrycooked")
        response_data = {"message": "Invalid Password"}
        raise InvalidPassword("Password Invalid")
    
    # We have check if the user has a password, if it meets basic password requirements 
    # and if it is in the database and matches the username. Now to create token 
    generateJWT
    
    
    




    return jsonify(response_data), 200




if __name__ == "__main__":
    app.run()
