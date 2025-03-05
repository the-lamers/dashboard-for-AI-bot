import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
} from "recharts";

const lightenColor = (color: string, percent: number) => {
  const num = parseInt(color.replace("#", ""), 16);
  const r = (num >> 16) + Math.round((255 - (num >> 16)) * percent);
  const g =
    ((num >> 8) & 0x00ff) + Math.round((255 - ((num >> 8) & 0x00ff)) * percent);
  const b = (num & 0x0000ff) + Math.round((255 - (num & 0x0000ff)) * percent);
  return `#${(1 << 24 | (r << 16) | (g << 8) | b)
    .toString(16)
    .slice(1)}`;
};

interface UnifiedBarChartProps {
  title: string;
  data: Array<{ name: string; [key: string]: any }>;
  fillColor: string;
  dataKey: string;
  interactive?: boolean;
  showGrid?: boolean;
}

const UnifiedBarChart: React.FC<UnifiedBarChartProps> = ({
  title,
  data,
  fillColor,
  dataKey,
  interactive = false,
  showGrid = false,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const containerWidth = chartContainerRef.current.offsetWidth;
    const totalLabelWidth = data.reduce((acc, item) => {
      return acc + (item.name?.length || 0) * 8 + 20;
    }, 0);
    setShowLabels(totalLabelWidth < containerWidth);
  }, [data]);

  return (
    <Card sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ height: 250 }} ref={chartContainerRef}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" stroke="#E0E0E0" tick={showLabels ? undefined : false} />
              <YAxis stroke="#E0E0E0" />
              <Tooltip cursor={{ fill: "rgba(255, 255, 255, 0.2)" }} />
              <Bar dataKey={dataKey} onMouseLeave={() => setActiveIndex(null)}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      interactive && activeIndex === index
                        ? lightenColor(fillColor, 0.3)
                        : fillColor
                    }
                    onMouseEnter={interactive ? () => setActiveIndex(index) : undefined}
                    style={{
                      cursor: interactive ? "pointer" : "default",
                      transition: interactive ? "fill 0.3s ease-in-out" : undefined,
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

export default UnifiedBarChart;
