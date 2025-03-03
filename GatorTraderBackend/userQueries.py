
import psycopg2
import json
import re
from initdb import get_db_connection


BAD_WORDS = ["admin", "root", "fuck", "shit", "asshole"]


def validateEmail(email):  # Validates the email
    print(email, "begin validation")
    if not re.match(r'^[A-Za-z0-9@._%+-]{6,254}$', email):
        print("Here")
        return False

    if any(bad in email.lower() for bad in BAD_WORDS):
        return False

    return email


def validateUsername(username):  # Validates the username
    print(username)
    return username


def validatePassword(password):
    print(password)
    return password


def signUp(username,password,profile_pic,email):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO users (username, password, profile_pic, email)'
                'VALUES (%s, %s, %s, %s)', (username, password,
                                            profile_pic, email))

    cur.execute("SELECT * FROM users")

    # Fetch all rows from the query result
    rows = cur.fetchall()

    # Print each row
    for row in rows:
        print(row)

    conn.commit()

    cur.close()
    conn.close()


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
