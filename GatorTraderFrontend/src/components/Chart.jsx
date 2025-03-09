import React, { useState, useEffect, useRef } from "react";
import { getLocalStockData } from "../utils/dataUtil";
import {ChartCanvas, Chart} from "react-financial-charts";
import { AreaSeries } from "react-financial-charts";
import { XAxis, YAxis } from "react-financial-charts";
import { scaleTime, scaleLinear } from "d3-scale";
import { curveMonotoneX } from "d3-shape";


const AreaChart = ({ ratio, type }) => {
    const [data, setData] = useState([]);
    const [chartWidth, setCharWidth] = useState(Math.min(window.innerWidth * 0.8, 800));
    const canvasRef = useRef(null);
    const graidentRef = useRef(null);

    useEffect(() => {
        setData(getLocalStockData());

        const handleResize = () => {
            setCharWidth(Math.min(window.innerWidth * 0.8, 800));
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    const createGradient = (ctx, canvas) => {
        const graident = ctx.createLinearGradient(0, canvas.height, 0, 0);
        graident.addColorStop(0.05, "rgba(0, 200, 83, 0.2)");  // 5% offset
        gradient.addColorStop(0.7, "rgba(0, 176, 64, 0.4)");  // 70% offset
        gradient.addColorStop(1, "rgba(0, 128, 0, 0.8)");    // 100% offset)
        return gradient;
    }

    return data.length > 0 ? (
        <div className = "chart-wrapper">
            <ChartCanvas
            ref={canvasRef}
            ratio={ratio}
            width={chartWidth}
            height={400}
            margin={{ left: 100, right: 20, top: 10, bottom: 30 }}
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
                        <stop offset="5%" stop-color="#00c853" />
                        <stop offset="70%" stop-color="#00b040" />
                        <stop offset="100%" stop-color="#008000"/>
                    </linearGradient>
                </defs>
                <XAxis axisAt="bottom" orient="bottom" ticks={6} />
                <YAxis axisAt="left" orient="left" />
                <AreaSeries
                    yAccessor={(d) => d.close}
                    strokeStyle="#00b040"
                    fillStyle="rgba(0, 128, 0, 0.2)"
                    strokeWidth={2}
                    interpolation={curveMonotoneX}
                />
            </Chart>
        </ChartCanvas>
        </div>
        ) : (
        <p>Loading data...</p>

    );

        
        

};

export default AreaChart;