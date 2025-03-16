import React, { useState, useEffect, useRef } from "react";
import { getLocalStockData } from "../utils/dataUtil";
import {ChartCanvas, Chart} from "react-financial-charts";
import { AreaSeries } from "react-financial-charts";
import { XAxis, YAxis } from "react-financial-charts";
import { scaleTime } from "d3-scale";
import { curveMonotoneX } from "d3-shape";


const AreaChart = ({ ticker, data, ratio, type }) => {
    if(!data || data.length === 0){
        return <p>No data available for this stock.</p>
    }

    const canvasRef = useRef(null);

    const createGradient = (ctx, height) => {
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0.05, "rgba(0, 200, 83, 0.2)");  // 5% offset
        gradient.addColorStop(0.5, "rgba(0, 176, 64, 0.4)");  // 70% offset
        gradient.addColorStop(1, "rgba(0, 128, 0, 0.8)");    // 100% offset)
        return gradient;
    }

    return data.length > 0 ? (
        <div className = "chart-wrapper">
            <ChartCanvas
            ref={canvasRef}
            ratio={ratio}
            width={800}
            height={400}
            margin={{ left: 100, right: 20, top: 10, bottom: 30 }}
            seriesName={ticker}
            data={data}
            type={type}
            xAccessor={(d) => d.date}
            xScale={scaleTime()}
            xExtents={[data[0]?.date, data[data.length - 1]?.date]}
        >
            <Chart id={0} yExtents={[(d) => d.close]}>
                <XAxis axisAt="bottom" orient="bottom" ticks={6} />
                <YAxis axisAt="left" orient="left" />
                <AreaSeries
                    yAccessor={(d) => d.close}
                    strokeStyle="#00b040"
                    fillStyle= {(ctx, { height }) => createGradient(ctx, height)}
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