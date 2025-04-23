import psycopg2
import os
import sys

print("Python version:", sys.version)
print("Current working directory:", os.getcwd())
print("Files in current directory:", os.listdir("."))

try:
    print("Attempting to connect to 'postgres' host...")
    conn = psycopg2.connect(
        host="postgres",
        port=5432,
        database="gatortrader",
        user="sammy",
        password="password"
    )
    print("SUCCESS: Connected to postgres!")
    conn.close()
except Exception as e:
    print(f"FAILED: Could not connect to postgres: {e}")

try:
    print("Attempting to connect to 'localhost' host...")
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        database="gatortrader",
        user="sammy",
        password="password"
    )
    print("SUCCESS: Connected to localhost!")
    conn.close()
except Exception as e:
    print(f"FAILED: Could not connect to localhost: {e}")