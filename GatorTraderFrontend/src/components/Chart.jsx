import React, { useState, useEffect } from "react";
import { getLocalStockData } from "../utils/dataUtil";
import PropTypes from "prop-types";

import { scaleTime } from "d3-scale";
import { curveMonotoneX } from "d3-shape";

import { ChartCanvas, Chart } from "react-stockcharts";
import { AreaSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";
import {
    createVerticalLinearGradient, 
    hexToRGBA, 
}  from "react-stockcharts/lib/utils";



// Create gradient colors for area chart
const canvasGradient = createVerticalLinearGradient([
    {stop: 0.05, color: hexToRGBA("#00c853", 0.2)}, 
    {stop: 0.2, color: hexToRGBA("#00b040", 0.4)},
    {stop: 1, color: hexToRGBA("#008000", 0.8)},
]);


const AreaChart = ({ width, ratio, type }) => {
    const [data, setData] = useState([]);

    // Load local stock data on mount
    useEffect(() => {
        setData(getLocalStockData());
    }, []);

    return data.length > 0 ? (
        <ChartCanvas
            ratio={ratio}
            width={width}
            height={400}
            margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
            seriesName="NVDA" 
            data={data}
            type={type}
            xAccessor={(d) => d.date} // Corrected key
            xScale={scaleTime()}
            xExtents={[data[0].date, data[data.length - 1].date]} // Fix dynamic range
        >
            <Chart id={0} yExtents={(d) => d.close}> 
                <defs>
                    <linearGradient id="myGradient" x1="0" y1="100%" x2="0" y2="0%">
                        <stop offset="5%" stopColor="#00c853" stopOpacity={0.2} />
                        <stop offset="70%" stopColor="#00b040" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#008000" stopOpacity={0.8} />
                    </linearGradient>
                </defs>
                <XAxis axisAt="bottom" orient="bottom" ticks={6} />
                <YAxis axisAt="left" orient="left" />
                <AreaSeries
                    yAccessor={(d) => d.close} 
                    fill="url(#myGradient)"
                    stroke="#00b040"
                    strokeWidth={2}
                    interpolation={curveMonotoneX}
                    canvasGradient={canvasGradient}
                />
            </Chart>
        </ChartCanvas>
    ) : (
        <p>Loading data...</p>
    );
};

AreaChart.propTypes = {
    width: PropTypes.number.isRequired,
    ratio: PropTypes.number.isRequired,
    type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

AreaChart.defaultProps = {
    type: "svg",
};

export default fitWidth(AreaChart);