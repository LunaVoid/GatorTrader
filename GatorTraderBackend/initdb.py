import os
import psycopg2

conn = psycopg2.connect(
        host="localhost",
        database="gatortrader",
        #user=os.environ['sammy'],
        user="sammy",
        password="password")
        #password=os.environ['password'])


cur = conn.cursor();
cur.execute('DROP TABLE IF EXISTS users;')
#optimize later to not recreate every time 
cur.execute('CREATE TABLE users (id serial PRIMARY KEY,'
                                 'username varchar (20) NOT NULL,'
                                 'password varchar (20) NOT NULL,'
                                 'profile_pic bytea,'
                                 'email varchar (255) NOT NULL,'
                                 'date_added date DEFAULT CURRENT_TIMESTAMP);'
                                 )
# Insert data into the table
cur.execute('INSERT INTO users (username, password, profile_pic, email)'
            'VALUES (%s, %s, %s, %s)',
            ('hiral',
             'passowrd',
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





def get_db_connection():  # Validates the email
    conn = psycopg2.connect(host='localhost',
                            database='gatortrader',
                            # user=os.environ['DB_USERNAME'],
                            user="sammy",
                            password="password")
    return conn

