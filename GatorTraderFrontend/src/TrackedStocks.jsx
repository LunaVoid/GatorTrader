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
  const stockDescriptions = {
    "NVDA": {
      founded: "1993",
      industry: "Semiconductor and Artificial Intelligence",
      overview: "NVIDIA designs GPUs for gaming and professional markets, as well as AI and high-performance computing.",
      popularity: "NVIDIA's stock has experienced significant growth, becoming one of the top performers in the market."
    },
    "GOOGL": {
      founded: "1998",
      industry: "Technology and Internet Services",
      overview: "Alphabet is the parent company of Google, offering services like search, advertising, cloud computing, and hardware products.",
      popularity: "Alphabet's stock is among the top companies by market capitalization, reflecting its strong market presence."
    },
    "AMZN": {
      founded: "1994",
      industry: "E-commerce, Cloud Computing, and Digital Streaming",
      overview: "Amazon started as an online bookstore and evolved into a global e-commerce, cloud, and digital streaming giant.",
      popularity: "Amazon's stock has shown significant growth, ranking among the largest companies by market cap."
    },
    "MSFT": {
      founded: "1975",
      industry: "Technology and Software",
      overview: "Microsoft develops, licenses, and sells computer software, hardware, and services, including Azure cloud.",
      popularity: "Microsoft remains one of the most valuable companies globally, with its stock maintaining a strong position in the market."
    },
    "TSLA": {
      founded: "2003",
      industry: "Electric Vehicles and Clean Energy",
      overview: "Tesla designs and manufactures electric vehicles and renewable energy products.",
      popularity: "Tesla's stock has experienced volatility but remains among the top companies by market capitalization."
    },
    "AAPL": {
      founded: "1976",
      industry: "Technology and Consumer Electronics",
      overview: "Apple designs and manufactures consumer electronics, software, and online services, including the iPhone and Mac.",
      popularity: "Apple's stock is among the largest by market capitalization, reflecting its strong market presence."
    },
    "JPM": {
      founded: "2000 (merger)",
      industry: "Financial Services",
      overview: "JPMorgan Chase is a multinational investment bank and financial services company.",
      popularity: "JPMorgan Chase is a leading financial institution, with its stock reflecting its significant role in the banking sector."
    },
    "BAC": {
      founded: "1998 (merger)",
      industry: "Financial Services",
      overview: "Bank of America offers banking and financial services, including consumer banking and investment management.",
      popularity: "Bank of America is one of the largest financial institutions, with its stock maintaining a strong presence in the market."
    },
    "NFLX": {
      founded: "1997",
      industry: "Streaming Entertainment",
      overview: "Netflix is a streaming service offering a wide variety of content in over 190 countries.",
      popularity: "Netflix's stock has seen significant growth, reflecting its leading position in the streaming industry."
    },
    "META": {
      founded: "2004",
      industry: "Social Media and Technology",
      overview: "Meta Platforms owns and operates social media platforms like Facebook, Instagram, and WhatsApp.",
      popularity: "Meta's stock is among the top companies by market capitalization, reflecting its strong market presence."
    }
  };

  

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
              <h2>Price</h2>
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
            
            
            
              {loading && <div className = "poppup">
                  <h3>Welcome to Gator Trader!</h3>
                  Please select a stock from the sidebar to get started. Once a stock is selected, feel free to zoom in and drag the graph to view the stock trends you are interested in.
                </div>}
              {!loading && !stockData && <p>No data available for {selectedTicker}.</p>}
              {!loading && stockData && (
              <div className="chart-wrapper">
                <h3 className= "selected-stock"> Selected Stock: {selectedTicker}</h3>
                <AreaChart ticker={selectedTicker} data={stockData} ratio={3} type="svg"  />
                
                { /*Stock Descriptions */}
                <div className = "description-box">
                  <h4>About {selectedTicker}</h4>
                  <p><strong>Founded:</strong> {stockDescriptions[selectedTicker]?.founded}</p>
                  <p><strong>Industry:</strong> {stockDescriptions[selectedTicker]?.industry}</p>
                  <p><strong>Overview:</strong> {stockDescriptions[selectedTicker]?.overview}</p>
                  <p><strong>Popularity:</strong> {stockDescriptions[selectedTicker]?.popularity}</p>
                </div>
              </div>
              
              
            )}
          </div>
        </div>
        </div>   
                   
        <div className="footer-bar tracked-stocks-footer"></div>
      </div>
    
  );
}

export default TrackedStocks;
