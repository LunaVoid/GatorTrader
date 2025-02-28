import { useState } from 'react';
import { useEffect } from 'react'
import './components/Scroll.jsx'
import{ Link } from 'react-router-dom';
import './App.css';
import './Login.css';
import './TrackedStocks.css';
import Navbar from './components/Navbar';
import ScrollableComponent from './components/Scroll.jsx';


function TrackedStocks() {
  const [stockChanges, setStockChanges] = useState({});
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [stockData, setStockData] = useState(null);  
  const [loading, setLoading] = useState(false);  

  const stockTickers = ["AAPL", "GOOGL", "AMZN", "MSFT", "TSLA", "DOW", "NASDAQ", "RUA", "UKX", "ETC", "ETC"];

  const handleTickerClick = (ticker) => {
      setSelectedTicker(ticker);
  };

  useEffect(() => {
      if (!selectedTicker) return;

      setLoading(true);

      const fetchStockData = async () => {
          try {
              const response = await fetch(`https://api.example.com/stocks/${selectedTicker}`);
              const data = await response.json();
              setStockData(data);
          } catch (error) {
              console.error("Error fetching stock data:", error);
          } finally {
              setLoading(false);
          }
      };

      fetchStockData();
  }, [selectedTicker]);

  useEffect(() => {
      const fetchStockChanges = async () => {
          try {
              const updatedChanges = {};

              for (const ticker of stockTickers) {
                  const response = await fetch(`https://api.example.com/stocks/${ticker}`);
                  const data = await response.json();

                  const open = parseFloat(data.open);
                  const close = parseFloat(data.close);
                  const percentChange = (((close - open) / open) * 100).toFixed(2);

                  updatedChanges[ticker] = percentChange;
              }

              setStockChanges(updatedChanges);
          } catch (error) {
              console.error("Error fetching stock changes:", error);
          }
      };

      fetchStockChanges();
      const interval = setInterval(fetchStockChanges, 60000);
      return () => clearInterval(interval);
  }, []);

  return (
      <div>
          <Navbar />
          <div className="centering">
              <div className="sidebar">
                  <div className="sidebar-header">
                      <h2>Stock</h2>
                      <h2>Trend</h2>
                  </div>
                  <ScrollableComponent stockTickers={stockTickers} handleTickerClick={handleTickerClick} stockChanges={stockChanges}/>
                  
              </div>
              <div className="stock-display">
                  <div className="selected-stock-container">
                      <h3 className="selected-stock">Stock Graph For {selectedTicker}</h3>
                  </div>
                  <img className="stockimage" src="../img/stocktrend.png" alt="Stock Trend" />

                  {loading ? (
                      <p>Loading stock data...</p>
                  ) : stockData ? (
                      <div>
                          <img 
                              className="stockimage" 
                              src={stockData.graphUrl || `../img/${selectedTicker}.png`} 
                              alt={`${selectedTicker} Graph`} 
                          />
                      </div>
                  ) : (
                    <div className="stock-display">
                    <div className="selected-stock-container">
                        <h3 className="selected-stock">No data available</h3>
                    </div>
                    
                </div>
                  )}
              </div>

              <div className="footer-bar"></div>
          </div>
      </div>
  );
}

export default TrackedStocks;