import React from "react";
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

function LineChartWithCrosshairs() {
  const data = [
    { date: new Date("2023-01-01"), value: 100 },
    { date: new Date("2023-01-02"), value: 110 },
    { date: new Date("2023-01-03"), value: 105 }
  ];

  const verticalLineDate = new Date("2023-01-02"); // 👈 static vertical line at this date

  return (
    <ChartCanvas
      width={800}
      height={400}
      data={data}
      seriesName="LineExample"
      xScale={scaleTime()}
      xAccessor={(d) => d.date}
      xExtents={[data[0].date, data[data.length - 1].date]}
      margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
    >
      <Chart id={0} yExtents={(d) => d.value}>
        <XAxis />
        <YAxis />
        <LineSeries yAccessor={(d) => d.value} />

        {/* Crosshair Labels */}
        <MouseCoordinateX displayFormat={(d) => d.toLocaleDateString()} />
        <MouseCoordinateY />

        {/* Static Vertical Line */}
        <StraightLine
          stroke="red"
          strokeDasharray="DashDot"
          opacity={0.9}
          xValue={verticalLineDate}
          orient="vertical"
        />
      </Chart>

      {/* Dynamic Crosshair that follows mouse */}
      <CrossHairCursor />
    </ChartCanvas>
  );
}

export default LineChartWithCrosshairs;