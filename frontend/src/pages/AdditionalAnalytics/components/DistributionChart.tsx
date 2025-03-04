import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Функция для осветления цвета
const lightenColor = (color, percent) => {
  const num = parseInt(color.replace("#", ""), 16);
  const r = (num >> 16) + Math.round((255 - (num >> 16)) * percent);
  const g = ((num >> 8) & 0x00ff) + Math.round((255 - ((num >> 8) & 0x00ff)) * percent);
  const b = (num & 0x0000ff) + Math.round((255 - (num & 0x0000ff)) * percent);
  return `#${(1 << 24 | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

export const DistributionChart = ({ title, data, fillColor }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <Card sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#E0E0E0" />
              <YAxis stroke="#E0E0E0" />
              <Tooltip cursor={{ fill: "rgba(255, 255, 255, 0.2)" }} />
              <Bar
                dataKey="value"
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      activeIndex === index
                        ? lightenColor(fillColor, 0.3) // осветляем на 30%
                        : fillColor
                    }
                    onMouseEnter={() => setActiveIndex(index)}
                    style={{
                      cursor: "pointer",
                      transition: "fill 0.3s ease-in-out",
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};
