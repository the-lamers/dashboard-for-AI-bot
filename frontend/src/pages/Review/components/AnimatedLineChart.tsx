import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, Typography } from "@mui/material";

const data = [
  { time: "10:00", responseTime: 3.5 },
  { time: "10:05", responseTime: 3.2 },
  { time: "10:10", responseTime: 3.8 },
  { time: "10:15", responseTime: 3.1 },
  { time: "10:20", responseTime: 3.0 }
];

const AnimatedLineChart: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Среднее время ответа по времени
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey="time" stroke="#E0E0E0" />
            <YAxis stroke="#E0E0E0" />
            <Tooltip contentStyle={{ backgroundColor: '#333', borderRadius: '8px', border: 'none' }} />
            <Legend />
            <Line type="monotone" dataKey="responseTime" stroke="#00E676" activeDot={{ r: 8 }} isAnimationActive={true} animationDuration={1500} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AnimatedLineChart;
