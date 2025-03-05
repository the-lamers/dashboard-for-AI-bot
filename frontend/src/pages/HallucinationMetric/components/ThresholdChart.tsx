import React from "react";
import { Paper, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface ThresholdChartProps {
  data: { name: string; value: number }[];
}

const ThresholdChart: React.FC<ThresholdChartProps> = ({ data }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" align="center" sx={{ mb: 2 }}>
        Пороговые значения
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#E0E0E0" />
          <YAxis stroke="#E0E0E0" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#333",
              borderRadius: "8px",
              border: "none"
            }}
          />
          <Bar
            dataKey="value"
            fill="#FF5252"
            isAnimationActive={true}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default ThresholdChart;
