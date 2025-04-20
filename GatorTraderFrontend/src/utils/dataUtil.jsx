import { timeParse } from "d3-time-format";

const parseDate = timeParse("%Y-%m-%d");

export async function getLocalStockData(ticker) {
    try {
        const filePath = `/data/data${ticker}.json`; 
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`Failed to load stock data for ${ticker}`);
        }

        const jsonData = await response.json();
        return transformStockData(jsonData);
    } catch (error) {
        console.error(`Error fetching stock data: ${error}`);
        return [];
    }
}

export function transformStockData(jsonData) {
    if (!jsonData || !jsonData["Time Series (Daily)"]) {
        console.error("Invalid JSON data format");
        return [];
    }

    const timeSeries = jsonData["Time Series (Daily)"];

    return Object.keys(timeSeries)
    .sort((a, b)=> new Date(a) - new Date(b))
    .map((date) => ({
        date: parseDate(date), 
        close: parseFloat(timeSeries[date]["4. close"]),
    }))
}
