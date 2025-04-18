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
    

def setLevel(level, userid):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute('UPDATE users SET level= %s WHERE userid = %s ',(level, userid))

                # Optional: Verify the update
                cur.execute("SELECT userid, level FROM users WHERE userid = %s", (userid,))
                result = cur.fetchone()
                print(result)
                conn.commit()
                return (True) if result else (False)

    except OperationalError:
        print("Database Connection Error")
        raise DatabaseConnectionError("Connection to Database Failed")
    except Exception as e:
        raise AppError(f"Unexpected Error: {e}")

def getLevel(userid):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:

                # Optional: Verify the update
                cur.execute("SELECT level FROM users WHERE userid = %s", (userid,))
                result = cur.fetchone()
                print(result)
                conn.commit()
                return (True, result[0]) if result else (False)
    except OperationalError:
        print("Database Connection Error")
        raise DatabaseConnectionError("Connection to Database Failed")
    except Exception as e:
        raise AppError(f"Unexpected Error: {e}")

def deleteFavs(userid):
    try:
            with get_db_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute('DELETE FROM saved_stocks WHERE userid = %s;', (userid,))
                    # Optional: Verify the update
                    cur.execute("SELECT userid, ticker FROM saved_stocks WHERE userid = %s", (userid,))
                    result = cur.fetchone()
                    if result is not None:
                        raise AppError("Bruh")
                    print(result)
                conn.commit()
            return

    except OperationalError:
        print("Database Connection Error")
        raise DatabaseConnectionError("Connection to Database Failed")
        return
    except Exception as e:
        raise AppError(f"Unexpected Error DelFav: {e}")
        return



def setFavs(favoriteStocks, userid):
    insertedStocks = ""
    count = 0
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                for stock in favoriteStocks:
                    cur.execute('INSERT INTO saved_stocks (userid, ticker) VALUES (%s, %s) ', (userid, stock))
                    # Optional: Verify the update
                    cur.execute("SELECT userid, ticker FROM saved_stocks WHERE userid = %s AND ticker = %s", (userid, stock))
                    result = cur.fetchone()
                    insertedStocks += ", "+result[1]
                    count += 1
                    print(result)
        conn.commit()
        return count, insertedStocks

    except OperationalError:
        print("Database Connection Error")
        raise DatabaseConnectionError("Connection to Database Failed")
    except Exception as e:
        raise AppError(f"Unexpected Error setFav: {e}")



def getFavs(userid):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT userid, ticker FROM saved_stocks WHERE userid = %s", (userid,))
                results = cur.fetchall()
                print(results)
        conn.commit()
        tickers = [row[1] for row in results] if results else []
        return tickers

    except OperationalError:
        print("Database Connection Error")
        raise DatabaseConnectionError("Connection to Database Failed")
    except Exception as e:
        raise AppError(f"Unexpected Error setFav: {e}")

