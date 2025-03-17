import os
import psycopg2
from dotenv import load_dotenv

def get_db_connection():  # Validates the email
    load_dotenv()
    
    conn = psycopg2.connect(host=os.environ['DB_HOST'],
                            database=os.environ['DB_NAME'],
                            user=os.environ['DB_USERNAME'],
                            password=os.environ['DB_PASSWORD'])
    return conn
