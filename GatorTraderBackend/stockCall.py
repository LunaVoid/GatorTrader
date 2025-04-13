import config
import requests 
from alpha_vantage.timeseries import TimeSeries
import matplotlib.pyplot as plt
import pandas as pd
import json
import os
import sys


# citation: https://www.alphavantage.co/documentation/#dailyadj
# replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key

# something to research: chron job

# should probably put some of these in env for prod

hiral_api_key = '64BZRK8IBKFOWPH8'
josh_api_key = None
paige_api_key = 'HL7OAW6I6F0F6PQM'
shun_api_key = 'AHPYZRP0HFR3KTK0'
data_dir = '../GatorTraderFrontend/public/data'
stocks = ["GOOGL", "AMZN", "MSFT", "TSLA", "AAPL", "NFLX", "NVDA", "META", "JPM", "BAC"]

def saveStock(symbol):
    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={hiral_api_key}"

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        file_path =  os.path.join(data_dir, f"data{symbol}.json")

        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        print(f"Successfully saved {symbol} data to {file_path}")

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data for {symbol}: {e}")
        sys.exit(1)  

if __name__ == "__main__":
    
    if not os.path.exists(data_dir):
        print("Directory does not exist")
        sys.exit(1)

    for stock in stocks:
        saveStock(stock)

   

    




