import os
import psycopg2
os.environ['pguser'] = 'sammy'
os.environ['pgpassword'] = 'password'

def connecting():
    conn = psycopg2.connect(
            host="localhost",
            database="gatortrader",
            user= os.environ['pguser'],
            password=os.environ['pgpassword'])
    return conn


def createTable ():
    conn = connecting()
    cur = conn.cursor()
    cur.execute('DROP TABLE IF EXISTS stocks;')
    cur.execute('CREATE TABLE stocks (id serial PRIMARY KEY,'
                                    'name varchar (20) NOT NULL,'
                                    'date date NOT NULL,'
                                    'open decimal (10, 4) NOT NULL,'
                                    'high decimal (10, 4) NOT NULL,'
                                    'low decimal (10, 4) NOT NULL,'
                                    'close decimal (10, 4) NOT NULL,'
                                    'volume bigint NOT NULL,'
                                    'date_added date DEFAULT CURRENT_TIMESTAMP);'
                                    )
    conn.commit()
    cur.close()
    conn.close()
    print("Table 'stocks' created successfully.")
    


def addToDatabase(name, date, open, high, low, close, volume):
    conn = connecting()
    curr = conn.cursor()
    curr.execute('INSERT INTO stocks (name, date, open, high, low, close, volume)'
                'VALUES (%s, %s, %s, %s, %s, %s, %s)',
                (name,
                date,
                open,
                high,
                low,
                close,
                volume)
                )

    conn.commit()

    print(f"Inserted {name} - {date} | Open: {open}, High: {high}, Low: {low}, Close: {close}, Volume: {volume}")

    curr.close()
    conn.close()