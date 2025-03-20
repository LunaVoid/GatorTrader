from exceptions import DatabaseConnectionError, DuplicateError, AppError
from psycopg2 import OperationalError, Binary
from creds import get_db_connection
import base64



def setProfileImage(profile_pic, userid):
    try:
        file_bytes = profile_pic.read()
        mimetype = profile_pic.content_type
        #final = f"data:{mimetype};base64,{base64Code}"
        #print(final)
        print(file_bytes)
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute('UPDATE users SET profile_pic= %s, mimetype = %s WHERE userid = %s ',(file_bytes,mimetype,userid))

                # Optional: Verify the update
                cur.execute("SELECT userid, profile_pic FROM users WHERE userid = %s", (userid,))
                result = cur.fetchone()
                print(result)
                conn.commit()
                
                return (True, file_bytes) if result else (False, None)

    except OperationalError:
        print("Database Connection Error")
        raise DatabaseConnectionError("Connection to Database Failed")
    except Exception as e:
        raise AppError(f"Unexpected Error: {e}")


def getProfileImage(userid):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT userid, profile_pic, mimetype FROM users WHERE userid = %s", (userid,))
                result = cur.fetchone()
                conn.commit()
                return (True, result[1],result[2]) if result else (False, None)

    except OperationalError:
        print("Database Connection Error")
        raise DatabaseConnectionError("Connection to Database Failed")
    except Exception as e:
        raise AppError(f"Unexpected Error: {e}")
