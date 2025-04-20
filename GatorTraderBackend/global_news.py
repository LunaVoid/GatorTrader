import requests
import os
import json 

paige_api_key = 'HL7OAW6I6F0F6PQM'

tickers = ["NVDA", "GOOGL", "AMZN", "MSFT", "TSLA", "AAPL", "JPM", "BAC", "NFLX", "META"]

OUTPUT_DIR = "../GatorTraderFrontend/public/predicted"
os.makedirs(OUTPUT_DIR, exist_ok=True)


def sentiment_label(avg):
    """Match Alpha Vantage's official sentiment label scale."""
    if avg <= -0.35:
        return "bearish"
    elif -0.35 < avg <= -0.15:
        return "somewhat-bearish"
    elif -0.15 < avg < 0.15:
        return "neutral"
    elif 0.15 <= avg < 0.35:
        return "somewhat-bullish"
    elif avg >= 0.35:
        return "bullish"

def fetch_sentiment(ticker):
    """Fetch sentiment data for a given stock ticker from Alpha Vantage"""
    url = (
        f"https://www.alphavantage.co/query"
        f"?function=NEWS_SENTIMENT&tickers={ticker}&apikey={paige_api_key}"
    )

    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to fetch {ticker}: {response.status_code}")
        return "unavailable"

    try:
        data = response.json()
        articles = data.get("feed", [])
        scores = []

        for article in articles:
            for t in article.get("ticker_sentiment", []):
                if t.get("ticker") == ticker:
                    score = float(t.get("ticker_sentiment_score", 0))
                    scores.append(score)


        avg = sum(scores) / len(scores)
        print(f"{ticker} average score: {avg:.4f}")
        return sentiment_label(avg)

    except Exception as e:
        print(f"Error processing {ticker}: {e}")
        return "unavailable"

def main():
    print("Fetching sentiment scores...")
    sentiment_data = {}

    for ticker in tickers:
        sentiment = fetch_sentiment(ticker)
        print(f"{ticker}: {sentiment}")
        sentiment_data[ticker] = sentiment

    # Save result to JSON
    output_file = os.path.join(OUTPUT_DIR, "sentiment.json")
    with open(output_file, "w") as f:
        json.dump(sentiment_data, f, indent=4)

    print(f"Sentiment data saved to {output_file}")

if __name__ == "__main__":
    main()
