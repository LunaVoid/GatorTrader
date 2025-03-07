import { timeParse } from "d3-time-format";
import stockData from "../../../data.json";

const parseDate = timeParse("%Y-%m-%d"); // Parse date strings to Date objects

// Transform JSON stock data into the correct format
export function transformStockData(jsonData) {
    const timeSeries = jsonData["Time Series (Daily)"];
    
    return Object.keys(timeSeries).map((date) => ({
        date: parseDate(date), // Convert string to Date
        close: parseFloat(timeSeries[date]["4. close"]),
    })).reverse(); // Reverse to show oldest data first
}

// Function to get stock data locally
export function getLocalStockData() {
    return transformStockData(stockData);
}
