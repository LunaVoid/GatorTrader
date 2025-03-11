import os
import psycopg2
from encryption import passwordHashedSalted
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
cur.execute('CREATE TABLE users (id serial PRIMARY KEY,'
                                 'username varchar (20) NOT NULL,'
                                 'password varchar (255) NOT NULL,'
                                 'profile_pic bytea,'
                                 'email varchar (255) NOT NULL,'
                                 'date_added date DEFAULT CURRENT_TIMESTAMP);'
                                 )
# Insert data into the table
password = "password1"
password = passwordHashedSalted(password)
cur.execute('INSERT INTO users (username, password, profile_pic, email)'
            'VALUES (%s, %s, %s, %s)',
            ('hiral',
             password,
             None,
             'hiralshukla@ufl.edu')
            )
# Execute SELECT query
cur.execute("SELECT * FROM users")

# Fetch all rows from the query result
rows = cur.fetchall()

# Print each row
for row in rows:
    print(row)

conn.commit()

cur.close()
conn.close()