import os
import psycopg2

def get_db_connection():  # Validates the email
    conn = psycopg2.connect(host='localhost',
                            database='gatortrader',
                            # user=os.environ['DB_USERNAME'],
                            user="sammy",
                            password="password")
    return conn
