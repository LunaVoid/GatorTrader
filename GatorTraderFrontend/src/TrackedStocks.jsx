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
  const [latestPrices, setLatestPrices] = useState({});
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [stockData, setStockData] = useState(null);  
  const [loading, setLoading] = useState(true);  


  const stockTickers = ["NVDA", "GOOGL", "AMZN", "MSFT", "TSLA", "AAPL", "JPM", "BAC", "NFLX", "META"];


  const handleTickerClick = (ticker) => {
      setSelectedTicker(ticker);
  };

  useEffect(() => {
    async function fetchLatestPrices() {
      const updatedPrices = {};
      
      for (const ticker of stockTickers) {
        try {
          const data = await getLocalStockData(ticker);
          
          if (data.length > 0) {
            const latestClose = data[data.length - 1].close; 
            updatedPrices[ticker] = latestClose;
          } else {
            updatedPrices[ticker] = "N/A"; 
          }
        } catch (error) {
          console.error(`Error fetching latest price for ${ticker}:`, error);
          updatedPrices[ticker] = "N/A";
        }
      }

      setLatestPrices(updatedPrices); 
    }

    fetchLatestPrices();
  }, []);
  
  useEffect(() => {
    if(!selectedTicker) return;

    async function loadStockData() {
      setLoading(true);
      try {
        const data = await getLocalStockData(selectedTicker);
        console.log("Loaded stock data:", data);
        setStockData(data);
      } catch (error) {
        console.error("Error loading stock data:", error);
        setStockData(null);
      } finally {
        setLoading(false);
      }
    }

    loadStockData();
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
            <div className="custom-scrollable">
              {stockTickers.map((ticker) => (
                <button 
                  key={ticker} 
                  className="sidebar-row"
                  onClick={() => handleTickerClick(ticker)}
                >
            <span className="ticker-name">{ticker}</span>
            <span className={'trend-value'}>
                {latestPrices[ticker] !== undefined ? `$${latestPrices[ticker]}` : "Loading..."}
            </span>
                </button>
    ))}
      </div>
    </div>
      
  
    <div className="stock-container">
    <div className="stock-display">
    <h3 className= "selected-stock"> Selected Stock: {selectedTicker}</h3>
    {loading && <p>Loading stock data for {selectedTicker}...</p>}
            {!loading && !stockData && <p>No data available for {selectedTicker}.</p>}
            {!loading && stockData && (
              <AreaChart ticker={selectedTicker} data={stockData} ratio={3} type="svg"  />
            )}
    </div>
    </div>
    </div>
    
            
                   
    <div className="footer-bar"></div>
    </div>
    
  );
}

export default TrackedStocks;
