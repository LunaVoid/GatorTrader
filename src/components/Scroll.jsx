import React from 'react';

function ScrollableComponent({ stockTickers , handleTickerClick, stockChanges}) {
    return (
        <div className="custom-scrollable">
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
    );
}

export default ScrollableComponent;