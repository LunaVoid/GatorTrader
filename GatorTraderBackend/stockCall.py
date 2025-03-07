import config
import requests 
from alpha_vantage.timeseries import TimeSeries
import matplotlib.pyplot as plt
import pandas as pd
import json


# citation: https://www.alphavantage.co/documentation/#dailyadj
# replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key




#chron job

hiral_api_key = '64BZRK8IBKFOWPH8'
josh_api_key = 0
paige_api_key = 'HL7OAW6I6F0F6PQM'
shun_api_key = 'AHPYZRP0HFR3KTK0'

# with the way the API works, we can get stock data for 100 stocks a day
# however each call is one stock
# should give twenty years of data for that stock though with the latest data updated every morning
# I think we should update our data every day at 9am for the 100 stocks we track
# we can also just make it 25 to start and then scale up
# we need to store the data we get in a table in our gatortrader database fs


# my plan: get nvidia's data

if __name__ == "__main__":
    # url = f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=NVDA&apikey={hiral_api_key}'
    # r = requests.get(url)
    # data = r.json()
    # with open('data.json', 'w', encoding='utf-8') as f:
    #     json.dump(data, f, ensure_ascii=False, indent=4)
    #  print(data)
    with open('data.json') as f:
            d = json.load(f)
            # print d['']






