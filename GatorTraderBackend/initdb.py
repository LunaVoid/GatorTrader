import os
import psycopg2
from auth import passwordHashedSalted
import base64
os.environ['pguser'] = 'sammy'
os.environ['pgpassword'] = 'password'


conn = psycopg2.connect(
        host="localhost",
        database="gatortrader",
        user= os.environ['pguser'],
        password=os.environ['pgpassword'])


cur = conn.cursor();
cur.execute('DROP TABLE IF EXISTS users;')
#optimize later to not recreate every time 
cur.execute('''CREATE TABLE IF NOT EXISTS users (
    userid SERIAL PRIMARY KEY,
    profile_pic BYTEA,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email_token VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mimetype VARCHAR(255)
    );'''
)
cur.execute('''
    CREATE TABLE IF NOT EXISTS saved_stocks (
        stock_id SERIAL PRIMARY KEY,
        userid INT NOT NULL,
        ticker VARCHAR(10) NOT NULL,
        FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE
    );
''')

# Insert data into the table
file_bytes = ""
file_path = os.path.abspath('test/pikachu.png')
print(file_path)
with open(file_path, 'rb') as file:
    file_bytes = file.read()
    print(file_bytes)
password = "password1"
password = passwordHashedSalted(password)
cur.execute('INSERT INTO users (username, password, profile_pic, email, mimetype)'
            'VALUES (%s, %s, %s, %s, %s)',
            ('hiral',
             password,
             file_bytes,
             'hiralshukla@ufl.edu', 'image/webp')
            )
cur.execute('INSERT INTO saved_stocks (userid, ticker) VALUES (%s, %s);', (1, 'AAPL'))
cur.execute('INSERT INTO saved_stocks (userid, ticker) VALUES (%s, %s);', (1, 'MSFT'))
# Execute SELECT query
cur.execute("SELECT * FROM users")

# Fetch all rows from the query result
rows = cur.fetchall()

# Print each row
for row in rows:
    print(row)

cur.execute('SELECT profile_pic FROM users WHERE username = %s', ('hiral',))
retrieved_bytes = cur.fetchone()[0]

cur.execute('SELECT ticker FROM saved_stocks WHERE userid = %s;', (1,))
saved_stocks = cur.fetchall()
print("Saved stocks for user 1:")
for stock in saved_stocks:
    print(stock)

conn.commit()

print(file_bytes ==  retrieved_bytes)

cur.close()
conn.close()