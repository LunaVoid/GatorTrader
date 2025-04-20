import React, { useState, useEffect, useRef } from "react";
import {
  ChartCanvas,
  Chart,
  LineSeries,
  XAxis,
  YAxis,
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
  StraightLine
} from "react-financial-charts";
import { scaleTime } from "d3-scale";

function PredictionChart({ data, cutoffDate, sentiment }) {
  if (!data || data.length === 0) {
    return <p>No prediction data available.</p>;
  }

  const canvasRef = useRef(null)

  const xAccessor = (d) => d.date;

  return (
    <div className="prediction-chart-wrapper">
      <ChartCanvas
        ref={canvasRef}
        width={800}
        height={400}
        data={data}
        seriesName="PredictionSeries"
        xScale={scaleTime()}
        xAccessor={xAccessor}
        xExtents={[xAccessor(data[0]), xAccessor(data[data.length - 1])]}
        margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
      >
        <Chart id={0} yExtents={(d) => d.value}>
          <XAxis axisAt="bottom" orient="bottom" ticks={6} />
          <YAxis axisAt="left" orient="left" />

          {/* Main line series */}
          <LineSeries yAccessor={(d) => d.value} stroke="#0077cc" />

          {/* Crosshair coordinates */}
          <MouseCoordinateX displayFormat={(d) => d.toLocaleDateString()} />
          <MouseCoordinateY />

          {/* Static vertical line at prediction boundary */}
          <StraightLine
            stroke="red"
            strokeDasharray="DashDot"
            opacity={0.9}
            xValue={cutoffDate}
            orient="vertical"
          />
        </Chart>

        <CrossHairCursor />
      </ChartCanvas>

      {/* Sentiment display */}
      <div style={{ marginTop: "10px", fontStyle: "italic", color: "#555" }}>
        Market Sentiment: <strong>{sentiment?.label || "unavailable"}</strong> (Score: {sentiment?.score ?? "N/A"})
      </div>
    </div>
  );
}

export default PredictionChart;