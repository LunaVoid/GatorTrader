import { useState } from 'react';
import { useEffect } from 'react'
import './components/Scroll.jsx'
import{ Link } from 'react-router-dom';
import './App.css';
import './Login.css';
import './TrackedStocks.css';
import Navbar from './components/Navbar';
import ScrollableComponent from './components/Scroll.jsx';
import AreaChart from './components/Chart';
import { getLocalStockData } from "./utils/dataUtil"; 

function TrackedStocks() {
  const [stockChanges, setStockChanges] = useState({});
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [stockData, setStockData] = useState(null);  
  const [loading, setLoading] = useState(true);  

  const stockTickers = ["NVDA", "GOOGL", "AMZN", "MSFT", "TSLA", "AAPL", "NASDAQ", "RUA", "UKX", "ETC", "ETC"];

  const handleTickerClick = (ticker) => {
      setSelectedTicker(ticker);
  };

  // Example list of stock tickers (this can be fetched from an API)

  useEffect(() => {
    // const fetchStockChanges = async () => {
    //     try {
    //         const updatedChanges = {};

    //         for (const ticker of stockTickers) {
    //             const response = await fetch(`https://api.example.com/stocks/${ticker}`);
    //             const data = await response.json();

    //             // Extract stock percentage change (modify according to API structure)
    //             const open = parseFloat(data.open);
    //             const close = parseFloat(data.close);
    //             const percentChange = (((close - open) / open) * 100).toFixed(2);

    //             updatedChanges[ticker] = percentChange;
    //         }

    //         setStockChanges(updatedChanges);
    //     } catch (error) {
    //         console.error("Error fetching stock changes:", error);
    //     }
    // };

    setTimeout(() => {
      const data = getLocalStockData();
      console.log("Loaded stock data:", data);
      setStockData(data);
      setLoading(false);
    }, 500);

    // fetchStockChanges();
    // const interval = setInterval(fetchStockChanges, 60000); // Refresh every minute
    // return () => clearInterval(interval);
    }, [selectedTicker]);
    
    return (
      <div>
        
        
        <Navbar/>
          {/* Sidebar */}
    <div className = "centering">
    <div className="sidebar">
      <div className="sidebar-header">
          <h2>Stock</h2>
          <h2>Trend</h2>
      </div>
      {stockTickers.map((ticker) => (
        <button 
            key={ticker} 
            className="sidebar-row"
            onClick={() => handleTickerClick(ticker)}
        >
            <span className="ticker-name">{ticker}</span>
            <span className={`trend-value ${stockChanges[ticker] < 0 ? "negative" : "positive"}`}>
                {stockChanges[ticker] ? `${stockChanges[ticker]}%` : "Loading..."}
            </span>
        </button>
    ))}
    </div>
  
          <div>
              <div className="stock-chart-container">
                    {loading ? (
                        <p>Loading stock data...</p>
                    ) : stockData && stockData.length > 0 ? (
                        <AreaChart data={stockData} width={800} ratio={3} type="svg" />
                    ) : (
                        <img className="stockimage" src={stockImage} alt="Stock Trend" />
                    )}
              </div>
          </div>
        </div>
        <div>
          <h3>Selected Stock: {selectedTicker}</h3>
          {/* Show loading state */}
          {loading ? (
            <p>Loading stock data...</p>
          ) : (
            <div>
              {/* Placeholder for the stock graph */}
              {stockData ? (
                <div>
                  {/* Assuming the API returns a graph URL or some other data */}
                  <img 
                    className="stockimage" 
                    src={stockData.graphUrl || `../img/${selectedTicker}.png`} 
                    alt={`${selectedTicker} Graph`} 
                  />
                </div>
                  ):(
                    <p>No data available</p>
                    )}
              </div>
                    )}
              <div className="footer-bar"></div>
          </div>
      </div>
  );
}

export default TrackedStocks;
