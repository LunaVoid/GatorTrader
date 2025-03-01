'''this is where our backend will be written it is in
the main folder because it makes it easier to serve the react app'''

from flask import Flask, request, jsonify
from userQueries import signUp, validateEmail, validatePassword


app = Flask(__name__, static_folder='./GatorTraderFrontend/dist', static_url_path='/')


@app.route("/")
def serveReact():
    print("Sending home page")
    return app.send_static_file('index.html')


@app.route("/signup", methods=["POST"])
def signupFunction():
    data = request.get_json()
    # Print the data for debugging (you can log or store it as needed)
    print("Received data:", data["username"], data["password"],
          data["profile_pic"], data["email"], data["email"],
          data["date_added"])
    # First we validate the username, password and email

    email = data["email"]
    print(email)
    if email is None or not validateEmail(email):
        print("invalid")
        response_data = {"message": "Invalid Email"}
        return jsonify(response_data), 400

    if not validateEmail(email):
        print("invalid")
        response_data = {"message": "Invalid Email"}
        return jsonify(response_data), 400

    signUp(data["username"], data["password"], data["profile_pic"],
           data["email"])

    response_data = {"message": "Signup successful"}

    # Return a response with status code 200
    return jsonify(response_data), 200


if __name__ == "__main__":
    app.run()
