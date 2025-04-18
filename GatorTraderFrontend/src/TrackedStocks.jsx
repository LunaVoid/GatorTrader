import { useState } from 'react';
import { useEffect } from 'react'
import './components/Scroll.jsx'
import{ Link } from 'react-router-dom';
import './App.css';
import './Login.css';
import './TrackedStocks.css';
import Navbar from './components/Navbar';
import AreaChart from './components/Chart';
import { getLocalStockData } from "./utils/dataUtil"; 
import { useUser } from './utils/userContext.jsx';

function TrackedStocks() {
  const [latestPrices, setLatestPrices] = useState({});
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [stockData, setStockData] = useState(null);  
  const [loading, setLoading] = useState(true); 
  const [favoriteStocks, setFavoriteStocks] = useState([]);
  const [showPredictor, setShowPredictor] = useState(false);
  const { favsGetter, token } = useUser();
  const stocks = ["NVDA", "GOOGL", "AMZN", "MSFT", "TSLA", "AAPL", "JPM", "BAC", "NFLX", "META"];
  const [shownStock, setShownStock] = useState(stocks)
  const [switched, setSwitched] = useState(false);
  
  //creates a list for favoriteStocks, checks if item is already on favorite lists and adds and removes it depending if its already on there
  const toggleFavorite = (ticker) => {
    setFavoriteStocks(prev =>
      prev.includes(ticker)
        ? prev.filter(item => item !== ticker)
        : [...prev, ticker]
    );
  };
  
  
  const stockDescriptions = {
    "NVDA": {
      founded: "1993",
      industry: "Semiconductors, Artificial Intelligence, and Computing",
      overview: "NVIDIA Corporation is a global leader in visual computing technologies. Initially known for pioneering the GPU, NVIDIA now plays a critical role in AI development, autonomous vehicles, data centers, and high-performance computing. Its cutting-edge platforms power innovations in fields ranging from gaming and creative design to scientific research.",
      popularity: "NVIDIA's stock has surged in recent years, driven by its leadership in AI and chip technology, making it a cornerstone in tech-focused portfolios and one of the most valuable semiconductor companies in the world."
    },
    "GOOGL": {
      founded: "1998",
      industry: "Internet Services, Digital Advertising, Artificial Intelligence",
      overview: "Alphabet Inc. is the parent company of Google and a conglomerate of companies developing technologies across search, cloud computing, self-driving cars (Waymo), life sciences (Verily), and more. Google remains its core business, leading the global market in digital advertising and data services.",
      popularity: "As one of the 'Big Five' tech companies, Alphabet consistently ranks among the highest in global market capitalization, with GOOGL shares widely held by both retail and institutional investors."
    },
    "AMZN": {
      founded: "1994",
      industry: "E-Commerce, Cloud Computing, Artificial Intelligence, Logistics",
      overview: "Amazon.com, Inc. began as an online bookstore and has transformed into one of the world's largest and most diverse tech companies. It dominates e-commerce, leads in cloud infrastructure through Amazon Web Services (AWS), and has a strong presence in AI, logistics, and digital entertainment.",
      popularity: "Amazon's stock reflects its vast ecosystem and innovation-driven growth. It is a frequent inclusion in major indexes and one of the most influential tech stocks globally."
    },
    "MSFT": {
      founded: "1975",
      industry: "Software, Cloud Computing, Productivity Tools, AI",
      overview: "Microsoft Corporation is a multinational tech giant best known for Windows, Microsoft Office, and its Azure cloud platform. It also owns LinkedIn, GitHub, and Xbox. The company is a key player in enterprise software, AI research, and cloud infrastructure.",
      popularity: "MSFT is considered a blue-chip stock and a favorite among long-term investors, consistently ranking among the top companies by market value and dividend strength."
    },
    "TSLA": {
      founded: "2003",
      industry: "Electric Vehicles, Clean Energy, Automotive Technology",
      overview: "Tesla, Inc. designs and manufactures electric vehicles (EVs), battery storage systems, and solar energy products. Led by Elon Musk, Tesla has redefined the auto industry by pushing boundaries in automation, battery tech, and sustainable transportation.",
      popularity: "Tesla's stock has shown dramatic volatility and growth, making it a symbol of the EV revolution and a frequent topic in both retail and institutional investing circles."
    },
    "AAPL": {
      founded: "1976",
      industry: "Consumer Electronics, Software, Digital Services",
      overview: "Apple Inc. is known globally for its innovative hardware and software products, including the iPhone, iPad, Mac, and Apple Watch, as well as services like iCloud, Apple Music, and the App Store. Its ecosystem is tightly integrated, delivering seamless user experiences.",
      popularity: "Apple is the first company to surpass a $3 trillion market cap, and its stock is a staple in both growth and value investing strategies, representing stability, innovation, and brand loyalty."
    },
    "JPM": {
      founded: "2000 (merger of J.P. Morgan & Co. and Chase Manhattan Bank)",
      industry: "Banking, Investment Services, Asset Management",
      overview: "JPMorgan Chase & Co. is the largest bank in the U.S. by assets, offering a wide array of financial services, including investment banking, asset management, consumer and commercial banking, and wealth management.",
      popularity: "JPM is a leader in global finance and a key component of major financial indexes. Its stock is viewed as a benchmark for the health of the banking sector."
    },
    "BAC": {
      founded: "1998 (merger of NationsBank and BankAmerica)",
      industry: "Financial Services, Retail Banking, Investment Banking",
      overview: "Bank of America Corporation provides banking, investing, asset management, and financial risk management services to individuals, corporations, and governments worldwide. It has a vast consumer banking footprint in the U.S.",
      popularity: "As one of the 'Big Four' banks in the U.S., BAC is widely held in financial portfolios and tracks overall economic trends, making it a bellwether for the financial services industry."
    },
    "NFLX": {
      founded: "1997",
      industry: "Streaming Media, Entertainment Technology, Content Production",
      overview: "Netflix, Inc. is a pioneer in streaming entertainment, offering on-demand movies, TV series, and original content across global markets. It produces critically acclaimed content through Netflix Studios and continues to expand into gaming and interactive media.",
      popularity: "Netflix's stock surged in the streaming era, earning a place among the 'FAANG' stocks. While competition has grown, NFLX remains a dominant force in global digital entertainment."
    },
    "META": {
      founded: "2004",
      industry: "Social Media, Virtual Reality, AI, Digital Advertising",
      overview: "Meta Platforms Inc. (formerly Facebook Inc.) owns and operates Facebook, Instagram, WhatsApp, and Oculus. It focuses on connecting people through digital platforms and is investing heavily in AI and the metaverse through initiatives like Reality Labs.",
      popularity: "Meta is a tech powerhouse in digital communication and advertising, with a stock that reflects both innovation potential and the evolving challenges of data privacy and regulation."
    }
  };

  

  const handleTickerClick = (ticker) => {
      setSelectedTicker(ticker);
  };

  useEffect(() => {
    async function fetchLatestPrices() {
      const updatedPrices = {};
      
      for (const ticker of stocks) {
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

  async function clickSaved(){
    if (switched){
      const fetchedData = await favsGetter(token)
      setShownStock(fetchedData)
      setSwitched(!switched)
    }
    else{
      setShownStock(stocks);
      setSwitched(!switched)
    }
  }
  
    
    return (
      <div>
    
        <Navbar/>
          {/* Sidebar */}
        <div className = "centering">
          <button
                className="saved-btn"
                onClick={() => clickSaved()}
              >
              {clickSaved() ? "Show all Stocks" : "Show saved stocks"}
              </button>
          <div className="sidebar">
            <div className="sidebar-header">
              <h2>Stock</h2>
              <h2>Price</h2>
            </div>
            <div className="custom-scrollable">
              {shownStock.map((ticker) => (
                <button 
                key={ticker} 
                className="sidebar-row"
                onClick={() => handleTickerClick(ticker)}
              >
                <span className="ticker-name">
                  <span 
                    onClick={(e) => {
                      e.stopPropagation(); // prevent selecting the stock
                      toggleFavorite(ticker);
                    }}
                    className={`star ${favoriteStocks.includes(ticker) ? 'favorited' : 'unfavorited'}`}
                    title={favoriteStocks.includes(ticker) ? 'Unfavorite' : 'Favorite'}
                  >
                    ★
                  </span>
                  {ticker}
                </span>
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
                  Please select a stock from the sidebar to get started. Once a stock is selected, feel free to zoom in and drag the graph to view the stock trends you are interested in. Click the stars next to the stocks you would like to keep track of more closely and navigate to the favorites tab to view those stocks only.
                </div>}
              {!loading && !stockData && <p>No data available for {selectedTicker}.</p>}
              {!loading && stockData && (
              <div className="chart-wrapper">
                <h3 className= "selected-stock"> Selected Stock: {selectedTicker}</h3>
                {/* Predictor Button */}
              <button
                className="predictor-btn"
                onClick={() => setShowPredictor(!showPredictor)}
              >
              {showPredictor ? "Hide Prediction" : "Predict Future Stock Behavior with AI"}
              </button>

            {/*show AreaChart or Predictor */}
            {showPredictor ? (
              <AreaChart ticker={selectedTicker} data={stockData} ratio={3} type="svg" />
            ) : (
              <AreaChart ticker={selectedTicker} data={stockData} ratio={3} type="svg" />
            )}
                
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
