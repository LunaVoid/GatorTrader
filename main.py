'''this is where our backend will be written it is in
the main folder because it makes it easier to serve the react app'''
from flask import Flask


app = Flask(__name__, static_folder='./GatorTraderFrontend/dist', static_url_path='/')

@app.route("/")
def serveReact():
    print("Sending home page")
    return app.send_static_file('index.html')




if __name__ == "__main__":
    app.run()
