import psycopg2
import json
import re
from initdb import get_db_connection
from psycopg2 import OperationalError
from exceptions import DatabaseConnectionError, DuplicateError, ValidationError, AppError


BAD_WORDS = ["admin", "root", "fuck", "shit", "asshole"]


def validateEmail(email):  # Validates the email
    if not isinstance(email, str):
        return False
    print(email, "begin validation")
    if not re.match(r'^[A-Za-z0-9@._%+-]{6,254}$', email):
        print("Here")
        return False

    if any(bad in email.lower() for bad in BAD_WORDS):
        return False
    return True


# USE WITH, IT USES TRANSACTIONS
def isDuplicate(email):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT* FROM users WHERE email = %s", (email,))
                rows = cur.fetchall()
                print(rows, "Rows")
                return len(rows) > 0
    except OperationalError:
        print("Database Connection Error")
        raise DatabaseConnectionError("Connection to Database Failed")
    except Exception as e:
        raise AppError(f"Unexpected Error: {e}")


def isDuplicateUsername(username):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT* FROM users WHERE username = %s", (username,))
                rows = cur.fetchall()
                print(rows, "Rows")
                return len(rows) > 0
    except OperationalError:
        print("Database Connection Error")
        raise DatabaseConnectionError("Connection to Database Failed")
    except Exception as e:
        raise AppError(f"Unexpected Error: {e}")
        return "unknown_error"


def validateUsername(username):  # Validates the username
    if not isinstance(username, str):
        return False
    if not re.match(r'^[A-Za-z0-9]{6,32}$', username):
        print("Username Invalid")
        return False
    return True


def validatePassword(password):
    if not isinstance(password, str):
        return False
    if not re.match(r'^[A-Za-z0-9]{6,32}$', password):
        print("Password Invalid")
        return False
    return True 


def signUp(username, password, profile_pic, email):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
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
    except OperationalError:
        print("Database Connection Error")
        raise DatabaseConnectionError("Connection to Database Failed")
    except Exception as e:
        raise AppError(f"Unexpected Error: {e}")
        return "unknown_error"


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
