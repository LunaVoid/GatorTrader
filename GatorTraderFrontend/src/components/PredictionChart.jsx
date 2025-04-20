import {
    ChartCanvas,
    Chart,
    LineSeries,
    XAxis,
    YAxis,
    CrossHairCursor,
    MouseCoordinateX,
    MouseCoordinateY
  } from "react-financial-charts";
  import { scaleTime } from "d3-scale";
  
  function LineChartWithCrosshairs() {
    const data = [
      { date: new Date("2023-01-01"), value: 100 },
      { date: new Date("2023-01-02"), value: 110 },
      { date: new Date("2023-01-03"), value: 105 }
    ];
  
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
  
          {/* Crosshair coordinate labels */}
          <MouseCoordinateX displayFormat={(d) => d.toLocaleDateString()} />
          <MouseCoordinateY />
  
        </Chart>
  
        <CrossHairCursor />
      </ChartCanvas>
    );
  }
  
  export default LineChartWithCrosshairs;