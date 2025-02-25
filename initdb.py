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

# Execute a command: this creates a new table
cur.execute('DROP TABLE IF EXISTS books;')
cur.execute('CREATE TABLE books (id serial PRIMARY KEY,'
                                 'title varchar (150) NOT NULL,'
                                 'author varchar (50) NOT NULL,'
                                 'pages_num integer NOT NULL,'
                                 'review text,'
                                 'date_added date DEFAULT CURRENT_TIMESTAMP);'
                                 )

# Insert data into the table

cur.execute('INSERT INTO books (title, author, pages_num, review)'
            'VALUES (%s, %s, %s, %s)',
            ('A Tale of Two Cities',
             'Charles Dickens',
             489,
             'A great classic!')
            )


cur.execute('INSERT INTO books (title, author, pages_num, review)'
            'VALUES (%s, %s, %s, %s)',
            ('Anna Karenina',
             'Leo Tolstoy',
             864,
             'Another great classic!')
            )

#postgres types

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


conn.commit()

cur.close()
conn.close()
