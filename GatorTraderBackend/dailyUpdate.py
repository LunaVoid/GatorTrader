import json
import os
from datetime import datetime
import psycopg2
import requests
import uploadData

# should probably put some of these in env for prod
os.environ['pguser'] = 'sammy'
os.environ['pgpassword'] = 'password'
hiral_api_key = '64BZRK8IBKFOWPH8'
data_dir = '../GatorTraderFrontend/dist/public/data/'
stocks = ["GOOGL", "AMZN", "MSFT", "TSLA", "AAPL", "NFLX", "NVDA", "META", "JPM", "BAC"]
updatedToday = False

def connecting():
    conn = psycopg2.connect(
            host="localhost",
            database="gatortrader",
            user= os.environ['pguser'],
            password=os.environ['pgpassword'])
    return conn

def latestJson(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)

    time_series = data.get("Time Series (Daily)", {})
    if not time_series:
        return None

    latest_date = max(datetime.strptime(date, "%Y-%m-%d") for date in time_series.keys())
    return latest_date.date()


def latestDatabase(symbol):
    conn = connecting()
    cur = conn.cursor()
    cur.execute("SELECT MAX(date) FROM stocks WHERE name = %s", (symbol, ))
    result = cur.fetchone()[0]
    cur.close()
    conn.close()
    return result

def fetchNewData(symbol, api_key):
    url = "https://www.alphavantage.co/query"
    params = {
        "function": "TIME_SERIES_DAILY",
        "symbol": symbol,
        "apikey": api_key,
        "datatype": "json"
    }
    response = requests.get(url, params=params)
    return response.json().get("Time Series (Daily)", {})    

def dailyUpdate(symbol, api_key, file_path):
    json_latest = latestJson(file_path)
    db_latest = latestDatabase(symbol)
    cutoff_date = max(json_latest, db_latest)

    new_data = fetchNewData(symbol, api_key)
    new_entries = {date: data for date, data in new_data.items() if datetime.strptime(date, "%Y-%m-%d").date() > cutoff_date}

    if not new_entries:
        print("No new data to add.")
        return

    # updating the json file with the newer entries
    with open(file_path, "r") as f:
        full_json = json.load(f)

    full_json["Time Series (Daily)"].update(new_entries)

    with open(file_path, "w") as f:
        json.dump(full_json, f, indent=2)

    # updating the database with the newer entries
    for date, row in new_entries.items():
        uploadData.addToDatabase(symbol, date, row["1. open"], row["2. high"], row["3. low"], row["4. close"], row["5. volume"])

def updateData():
    print("Running Update Data")
    for ticker in stocks: 
            dailyUpdate(ticker, hiral_api_key, f"{data_dir}data{ticker}.json")

if __name__ == "__main__":
    # if datetime.today().weekday() < 5 and not updatedToday:
        for ticker in stocks: 
            dailyUpdate(ticker, hiral_api_key, f"{data_dir}data{ticker}.json")

    # updatedToday = True
    