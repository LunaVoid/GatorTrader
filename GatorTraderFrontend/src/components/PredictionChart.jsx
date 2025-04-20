import React, { useRef } from "react";
import {
  ChartCanvas,
  Chart,
  AreaSeries,
  XAxis,
  YAxis,
  GenericChartComponent
} from "react-financial-charts";
import { scaleTime } from "d3-scale";
import { curveMonotoneX } from "d3-shape";

function PredictionChart({ data, cutoffDate, sentiment, ratio, type }) {
  if (!data || data.length === 0) {
    return <p>No prediction data available.</p>;
  }

  const canvasRef = useRef(null);

  const createGradient = (ctx, height) => {
    const gradient = ctx.createLinearGradient(0, height, 0, 0);
    gradient.addColorStop(0.05, "rgba(0, 200, 83, 0.2)");
    gradient.addColorStop(0.5, "rgba(0, 176, 64, 0.4)");
    gradient.addColorStop(1, "rgba(0, 128, 0, 0.8)");
    return gradient;
  };

  const VerticalLine = ({ xValue }) => {
    const drawOnCanvas = (ctx, moreProps) => {
      const { xScale, chartConfig: { height } } = moreProps;
      const x = xScale(xValue);

      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([]);
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      ctx.restore();
    };

    return (
      <GenericChartComponent
        canvasDraw={drawOnCanvas}
        drawOn={["pan", "mousemove", "draw", "zoom", "hover", "drag"]}
        clip={false}
      />
    );
  };

  return (
    <div className="prediction-chart-wrapper">
      <ChartCanvas
        ref={canvasRef}
        ratio={ratio}
        width={800}
        height={400}
        data={data}
        seriesName="PredictionSeries"
        xScale={scaleTime()}
        xAccessor={(d) => d.date}
        xExtents={[data[0]?.date, data[data.length - 1]?.date]}
        margin={{ left: 100, right: 20, top: 10, bottom: 30 }}
      >
        <Chart id={0} yExtents={(d) => d.value}>
          <XAxis axisAt="bottom" orient="bottom" ticks={6} />
          <YAxis axisAt="left" orient="left" />

          <AreaSeries
            yAccessor={(d) => d.value}
            strokeStyle="#00b040"
            fillStyle={(ctx, { height }) => createGradient(ctx, height)}
            strokeWidth={2}
            interpolation={curveMonotoneX}
          />
          <VerticalLine xValue={cutoffDate} />
        </Chart>
      </ChartCanvas>

      {/* Sentiment display */}
      <div style={{ marginTop: "10px", fontStyle: "italic", color: "#555" }}>
        Market Sentiment: <strong>{sentiment?.label || "unavailable"}</strong>{" "}
        (Score: {sentiment?.score ?? "N/A"})
      </div>
    </div>
  );
}

export default PredictionChart;