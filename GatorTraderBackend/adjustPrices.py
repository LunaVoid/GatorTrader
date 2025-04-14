import os
import psycopg2
from psycopg2 import extensions
import requests
import json
import sys
os.environ['pguser'] = 'sammy'
os.environ['pgpassword'] = 'password'

def connecting():
    conn = psycopg2.connect(
            host="localhost",
            database="gatortrader",
            user= os.environ['pguser'],
            password=os.environ['pgpassword'])
    return conn


"""
THE PLAN
API call the splits data for all the stocks we offer DONE
store that data in a database called splits DONE
while storing splits for a stock: DONE
go from most recent to least recent DONE
divide the closing price by the split factor DONE
for every closing price that came before  DONE
the split date DONE
once that is done, keep going until all DONE
splits are done DONE
move onto next stock DONE
make this automate for future? 
"""
paige_api_key = 'HL7OAW6I6F0F6PQM'
data_dir = '../GatorTraderFrontend/public/splits'
stocks = ["GOOGL", "AMZN", "MSFT", "TSLA", "AAPL", "NFLX", "NVDA", "META", "JPM", "BAC"]


def callSplits(symbol):
    url = f'https://www.alphavantage.co/query?function=SPLITS&symbol={symbol}&apikey={paige_api_key}'
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        file_path =  os.path.join(data_dir, f"splits{symbol}.json")

        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        print(f"Successfully saved {symbol} splits to {file_path}")

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data for {symbol}: {e}")
        sys.exit(1)  

def initalizeTable():
    conn = connecting()
    cur = conn.cursor()
    cur.execute('DROP TABLE IF EXISTS splits')
    cur.execute('CREATE TABLE splits (id serial PRIMARY KEY,'
                                    'name varchar (20) NOT NULL,'
                                    'date date NOT NULL,'
                                    'factor decimal (10, 4) NOT NULL,'
                                    'date_added date DEFAULT CURRENT_TIMESTAMP);'
                                    )
    conn.commit()
    cur.close()
    conn.close()
    print("Table 'splits' created successfully.")



def loopSplit():
    for file_name in os.listdir(data_dir):
        if file_name.endswith(".json"):  
            file_path = os.path.join(data_dir, file_name)

            try: 
                with open(file_path, "r", encoding="utf-8") as f:
                    splits_data = json.load(f)
                
                name = file_name.replace("splits", "").replace(".json", "")

                for split in splits_data.get("data", []):
                    try:
                        date = split["effective_date"]
                        factor = float(split["split_factor"])

                        addSplit(name, date, factor)

                    except (KeyError, ValueError) as e:
                        print(f"Skipping {name} on {date} due to data error: {e}")

            except (json.JSONDecodeError, KeyError, ValueError) as e:
                    print(f" Error processing {file_name}: {e}")

def addSplit(name, date, factor):
    conn = connecting()
    curr = conn.cursor()
    curr.execute('INSERT INTO splits (name, date, factor)'
                'VALUES (%s, %s, %s)',
                (name,
                date,
                factor)
                )
    conn.commit()

    print(f"Inserted {name} - {date} | Factor: {factor}")

    curr.close()
    conn.close()

def adjustPrices():
    conn = connecting()
    conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)
    
    try:
        with conn.cursor() as cur:
            cur.execute("""
            DO $$
            DECLARE
                split RECORD;
            BEGIN
                -- Loop through all splits, most recent first
                FOR split IN
                    SELECT name, date, factor
                    FROM splits
                    ORDER BY name, date DESC
                LOOP
                    IF split.factor != 1.0 THEN
                        UPDATE stocks
                        SET close = close / split.factor
                        WHERE name = split.name
                        AND date < split.date;

                        RAISE NOTICE 'Adjusted % for split on % with factor %',
                                    split.name, split.date, split.factor;
                    END IF;
                END LOOP;
            END $$;
            """)

            for notice in conn.notices:
                print(notice.strip())
            conn.notices.clear()

            print("Stock prices adjusted successfully!")

    except Exception as e:
        print("An error occurred:", e)
        conn.rollback()

    finally:
        conn.close()

def adjustUpdate(ticker):
    conn = connecting()
    file_path = f"../GatorTraderFrontend/public/data/data{ticker}.json"
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            stocks_data = json.load(f)
        
        time_series = stocks_data.get("Time Series (Daily)", {})
        if not time_series:
            print(f"No time series data found in {file_path}")
            return
        
        with conn.cursor() as curr:
            for date_str, daily_data in time_series.items():
                curr.execute("""
                    SELECT close FROM stocks
                    WHERE name = %s AND date = %s
                """, (ticker, date_str))

                result = curr.fetchone()
                if result:
                    db_close = float(result[0])
                    daily_data["4. close"] = f"{db_close:.4f}" 

        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(stocks_data, f, indent=4)

        print(f"Updated {ticker} closing prices in {file_path}")

    except Exception as e:
        print(f"Error updating {ticker}: {e}")
    finally:
        conn.close()



if __name__ == "__main__":
    # initalizeTable()
    # for stock in stocks: 
    #     callSplits(stock)
    # loopSplit()
    # adjustPrices()
    for stock in stocks:
        adjustUpdate(stock)
