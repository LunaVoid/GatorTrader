import React, { useState, useEffect } from "react";
import { getLocalStockData } from "../utils/dataUtil";
import {ChartCanvas, Chart} from "react-financial-charts";
import { AreaSeries } from "react-financial-charts";
import { XAxis, YAxis } from "react-financial-charts";
import { scaleTime, scaleLinear } from "d3-scale";
import { curveMonotoneX } from "d3-shape";

const AreaChart = ({ ratio, type }) => {
    const [data, setData] = useState([]);
    const [chartWidth, setCharWidth] = useState(window.innerWidth * 0.8);

    useEffect(() => {
        setData(getLocalStockData());

        const handleResize = () => {
            setCharWidth(window.innerWidth * 0.8)
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return data.length > 0 ? (
        <ChartCanvas
        ratio={ratio}
        width={chartWidth}
        height={400}
        margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
        seriesName="NVDA"
        data={data}
        type={type}
        xAccessor={(d) => d.date}
        xScale={scaleTime()}
        xExtents={[data[0]?.date, data[data.length - 1]?.date]}
    >
        <Chart id={0} yExtents={[(d) => d.close]}>
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
            />
        </Chart>
    </ChartCanvas>
) : (
    <p>Loading data...</p>

    );

};

export default AreaChart;