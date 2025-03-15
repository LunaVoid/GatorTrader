import os
import uploadData
import json

data_dir = "../GatorTraderFrontend/public/data"

def loopData():
    for file_name in os.listdir(data_dir):
        if file_name.endswith(".json"):  
            file_path = os.path.join(data_dir, file_name)

            try: 
                with open(file_path, "r", encoding="utf-8") as f:
                    stock_data = json.load(f)
                
                stock_symbol = file_name.replace("data", "").replace(".json", "")

                if "Time Series (Daily)" not in stock_data:
                    print("Error: No valid data found in {file_name}")
                    continue

                for date, daily_data in stock_data["Time Series (Daily)"].items():
                    try: 
                        open_price = float(daily_data["1. open"])
                        high = float(daily_data["2. high"])
                        low = float(daily_data["3. low"])
                        close_price = float(daily_data["4. close"])
                        volume = int(daily_data["5. volume"])

                        uploadData.addToDatabase(stock_symbol, date, open_price, high, low, close_price, volume)
                    
                    except (KeyError, ValueError) as e:
                        print(f"Skipping {stock_symbol} on {date} due to data error: {e}")

            except (json.JSONDecodeError, KeyError, ValueError) as e:
                    print(f" Error processing {file_name}: {e}")
    


if __name__ == "__main__":
    uploadData.createTable()
    loopData()
