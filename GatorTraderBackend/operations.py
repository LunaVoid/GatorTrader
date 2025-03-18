from exceptions import DatabaseConnectionError, DuplicateError, AppError
from psycopg2 import OperationalError, Binary
from creds import get_db_connection
import base64



def setProfileImage(profile_pic, userid):
    try:
        file_bytes = profile_pic.read()
        base64Code = base64.b64encode(file_bytes).decode('utf-8')
        mime_type = profile_pic.content_type
        final = f"data:{mime_type};base64,{base64Code}"
        #print(final)
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute('UPDATE users SET profile_pic = %s WHERE userid = %s ',(final, userid))

                # Optional: Verify the update
                cur.execute("SELECT userid, profile_pic FROM users WHERE userid = %s", (userid,))
                result = cur.fetchone()
                
                conn.commit()
                
                return (True, final) if result else (False, None)

    except OperationalError:
        print("Database Connection Error")
        raise DatabaseConnectionError("Connection to Database Failed")
    except Exception as e:
        raise AppError(f"Unexpected Error: {e}")
