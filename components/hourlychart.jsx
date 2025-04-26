"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function HourlyChart({ data }) {
  const chartData = data.map((hour) => ({
    time: hour.time.split(" ")[1], // Just the hour
    temp: hour.temp_c,
  }));

  return (
    <div className="h-[300px] w-full rounded-xl bg-white/10 p-4 pb-8 shadow-md backdrop-blur-md">
      <h2 className="mb-2 text-lg font-semibold text-white">
        Hourly Temperature
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="time" stroke="#fff" />
          <YAxis stroke="#fff" domain={["dataMin - 2", "dataMax + 2"]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "none",
              color: "white",
            }}
          />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="#60a5fa"
            strokeWidth={3}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
