import React from "react";
import { Box, Typography } from "@mui/material";

interface BarChartProps {
  data: number[];
  labels: string[];
  maxBarHeight?: number;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  labels,
}) => {
  return (
      <p>
        {data.map(( value, index ) => {
          return (
            <Box
              key={index}
              display="inline-block"
              flexDirection="column"
              alignItems="center"
              width="auto"
              flex="none"
              sx={{
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(5px)",
                borderRadius: 2,
                mx: 0.4,
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#fff",
                  display: "block",
                  margin: "5px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "hover",
                }}
                title={labels[index]}
              >
                {labels[index]}
              </Typography>
            </Box>
          );
        })}
      </p>
  );
};

export default BarChart;