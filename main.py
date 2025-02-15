'''this is where our backend will be written it is in
the main folder because it makes it easier to serve the react app'''

from flask import Flask
import os
import psycopg2
import json

def get_db_connection():
    conn = psycopg2.connect(host='localhost',
                            database='gatortrader',
                            #user=os.environ['DB_USERNAME'],
                            user="sammy",
                            password="password")
    return conn


app = Flask(__name__, static_folder='./GatorTraderFrontend/dist', static_url_path='/')

@app.route("/")
def serveReact():
    print("Sending home page")
    return app.send_static_file('index.html')

@app.route("/booksTest")
def sendBooks():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM books;')
    books = cur.fetchall()
    books_list = []
    for book in books:
        book_dict = {
            'id': book[0],  # Assuming first column is id
            'title': book[1],  # Assuming second column is title
            'author': book[2],  # Assuming third column is author
            'year': book[3],  # Assuming fourth column is year
        }
        books_list.append(book_dict)

        json_response = json.dumps(books_list)
    return json_response

if __name__ == "__main__":
    app.run()
