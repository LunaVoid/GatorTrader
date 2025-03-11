import bcrypt
from exceptions import DatabaseConnectionError, DuplicateError, AppError
from psycopg2 import OperationalError
from creds import get_db_connection
import jwt
from datetime import datetime, timezone, timedelta
import os
from exceptions import jwtExpired,  AppError

# CHANGE THIS FOR PROD
os.environ['TOPSECRET'] = 'ultrasecuresecretjwtsecretysecret'


def passwordHashedSalted(password):
    try:
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed_password.decode('utf-8')

    except TypeError as e:
        # Handle case where password is not a string
        raise TypeError("Password must be a string") from e
    except Exception as e:
        # Handle other unexpected errors
        raise RuntimeError(f"Password hashing failed: {str(e)}") from e


def generateJWT(userid, username, testFlag = False):
    # Generates a JWT token and returns it
    now = datetime.utcnow()
    createdAt = int(now.replace(tzinfo=timezone.utc).timestamp())
    expireDate = int((now + timedelta(hours=24)).replace(tzinfo=timezone.utc).timestamp())
    #print(expireDate)
    if(testFlag == True):
        expireDate = int((now - timedelta(hours=24)).replace(tzinfo=timezone.utc).timestamp())
    payload = {
        'userid': userid,
        'username': username,
        'exp': expireDate,
        'iat': createdAt
    }
    #print(os.environ['TOPSECRET'])
    token = jwt.encode(payload, os.environ['TOPSECRET'], algorithm="HS256")
    return token

def verifyJWT(token):
    try:
        data = jwt.decode(token, os.environ['TOPSECRET'], algorithms="HS256", options={
            "verify_signature": True,  # Critical - ensures token integrity
            "verify_exp": True,
            "verify_iat": True}, leeway=120)
        userid = data['userid']
        username = data['username']
        currentDate = data['exp']
        issueDate = data['iat']

        return data


    except jwt.ExpiredSignatureError:
            raise jwt.ExpiredSignatureError
    except jwt.InvalidTokenError:
            raise jwt.InvalidTokenError
        
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

    except OperationalError:
        print("Database Connection Error")
        raise DatabaseConnectionError("Connection to Database Failed")
    except Exception as e:
        raise AppError(f"Unexpected Error: {e}")
        return "unknown_error"

def isPasswordHashValid(username,password):
    print(username)
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM users WHERE username = %s",(username,))
                user = cur.fetchone() 
                theHash = user[2]
                theHash = theHash.encode('utf-8')
                print(f"Hash type: {type(theHash)}")
                print(f"Hash length: {len(theHash)}")
                password = password.encode('utf-8')
                return bcrypt.checkpw(password,theHash)
    except OperationalError:
        print("Database Connection Error")
        raise DatabaseConnectionError("Connection to Database Failed")
    except Exception as e:
        raise AppError(f"Unexpected Error: {e}")
#def login(username,password):
    #try

