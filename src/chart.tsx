interface DataPoint {
  date: string;
  cloudCover: string;
  number: number;
}

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  TooltipProps,
} from "recharts";

interface DataPoint {
  date: string;
  cloudCover: string;
  number: number;
}

const Chart: React.FC = () => {
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(49);

  useEffect(() => {
    const fetchDataAndSetChartData = async () => {
      const data = await fetchData();
      setChartData(data);
    };
    fetchDataAndSetChartData();
  }, []);

  const fetchData = async (): Promise<DataPoint[]> => {
    const response = await fetch("./data/test1.csv");
    const data = await response.text();
    const parsedData = data
      .split("\n")
      .slice(1)
      .map((row) => {
        let [date, cloudCover, number] = row.split(",");
        let time = date.slice(11, 16);
        date = date.slice(5, 10);
        date = date.replace("-", "/");
        date = date.slice(3, 5) + "/" + date.slice(0, 2);
        return { date, cloudCover, number: Number(number), time };
      });
    return parsedData;
  };

  const handleScroll: React.WheelEventHandler<HTMLDivElement> = (e) => {
    const delta = -e.deltaY;
    const newIndex = delta > 0 ? startIndex + 1 : startIndex - 1;
    if (newIndex >= 0 && newIndex <= chartData.length - 50) {
      setStartIndex(newIndex);
      setEndIndex(newIndex + 49);
      e.preventDefault(); // Prevent default scrolling behavior
    }
  };

  const customtooltip = (props: TooltipProps<any, any>) => {
    const { payload } = props;
    if (payload && payload.length > 0) {
      const dataPoint = payload[0].payload;
      return (
        <div
          className="custom-tooltip"
          style={{
            background: "lightgrey",
            color: "black",
            padding: "8px",
            paddingRight: "32px",
            border: "1px solid black",
            opacity: 0.5,
          }}
        >
          <p className="label">Current Time: {dataPoint.time}</p>
          <p className="label">Cloud Cover: {dataPoint.cloudCover}</p>
          <p className="label">
            Status:{" "}
            {dataPoint.number === 0
              ? "Regular"
              : dataPoint.number === 1
              ? "Cloudburst Imminent"
              : "Cloudburst Occured"}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomizedDot = ({ cx, cy, value, payload }: any) => {
    let number = payload.number;
    let color;
    if (number === 0) {
      color = "green";
    } else if (number === 1) {
      color = "orange";
    } else if (number === 2) {
      color = "red";
    }

    return <circle cx={cx} cy={cy} r={4} fill={color} />;
  };
  const CustomLegend = () => {
    return (
      <ul style={{ listStyleType: "none", padding: 0 }}>
        <li>
          <span style={{ color: "green" }}>&#9679;</span> Regular
        </li>
        <li>
          <span style={{ color: "orange" }}>&#9679;</span> Cloudburst Imminent
        </li>
        <li>
          <span style={{ color: "red" }}>&#9679;</span> Cloudburst Occured
        </li>
      </ul>
    );
  };

  return (
    <div
      onWheel={handleScroll}
      style={{
        justifyContent: "center",
        display: "flex",
        width: "1200px",
        margin: "auto",
        position: "relative",
        overflow: "visible",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <LineChart
          width={1000}
          height={600}
          data={chartData.slice(startIndex, endIndex + 1)}
          margin={{ left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={customtooltip} />
          <Legend
            align="center"
            verticalAlign="bottom"
            layout="horizontal"
            content={CustomLegend}
          />
          <Line
            type="monotone"
            dataKey="cloudCover"
            stroke="white"
            dot={CustomizedDot}
          />
        </LineChart>
      </div>
    </div>
  );
};

export default Chart;
