import { useState } from 'react';
import { useEffect } from 'react'
import './App.css';
import './Login.css';
import './TrackedStocks.css';
import './components/Navbar.jsx';


function TrackedStocks() {
    //const [count, setCount] = useState(0)
    const [stockChanges, setStockChanges] = useState({});

    const [selectedTicker, setSelectedTicker] = useState(null);
    const [stockData, setStockData] = useState(null);  // To store the fetched stock data
    const [loading, setLoading] = useState(false);  // To handle loading state

  // Example list of stock tickers (this can be fetched from an API)
    const stockTickers = ["AAPL", "GOOGL", "AMZN", "MSFT", "TSLA", "DOW", "NASDAQ", "RUA", "UKX"];

  // Function to handle selecting a ticker
    const handleTickerClick = (ticker) => {
        setSelectedTicker(ticker);
    };

  // Fetch stock data when the selected ticker changes
    useEffect(() => {
        if (!selectedTicker) return;

    // Set loading state before fetching
    setLoading(true);

    // Fetch stock data from an API or use a local source
    const fetchStockData = async () => {
      try {
        const response = await fetch(`https://api.example.com/stocks/${selectedTicker}`);
        const data = await response.json();
        setStockData(data); // Set the fetched stock data
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchStockData();
  }, [selectedTicker]); // Runs when selectedTicker changes
  useEffect(() => {
    const fetchStockChanges = async () => {
        try {
            const updatedChanges = {};

            for (const ticker of stockTickers) {
                const response = await fetch(`https://api.example.com/stocks/${ticker}`);
                const data = await response.json();

                // Extract stock percentage change (modify according to API structure)
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
    const interval = setInterval(fetchStockChanges, 60000); // Refresh every minute
    return () => clearInterval(interval);
}, []);
    
    return (
      <div>
        <head>
          <title>Stock Dashboard</title>
          <link rel="preconnect" href="https://fonts.googleapis.com"></link>
            <link rel="preconnect" href="https://fonts.gstatic.com"></link>
            <link href="https://fonts.googleapis.com/css2?family=K2D:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet"></link>
              
        </head>
        <Navbar/>
          {/* Sidebar */}
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
            <img className="stockimage" src= "../img/stocktrend.png"></img>
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
              ) : (
                <p>No data available for this stock.</p>
              )}
            </div> 
        )}
        </div>
        <div className="footer-bar"></div> 
            
        
      </div>
    );
  }
  
  export default TrackedStocks 
  
  