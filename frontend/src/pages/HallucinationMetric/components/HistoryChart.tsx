import React from "react";
import { Paper, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface HistoryChartProps {
  data: { date: string; value: number }[];
}

const HistoryChart: React.FC<HistoryChartProps> = ({ data }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" align="center" sx={{ mb: 2 }}>
        История метрики
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
          <XAxis dataKey="date" stroke="#E0E0E0" />
          <YAxis stroke="#E0E0E0" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#333",
              borderRadius: "8px",
              border: "none"
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#FF5252"
            activeDot={{ r: 8 }}
            isAnimationActive={true}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default HistoryChart;
