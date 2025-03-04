import React from "react";
import { Box, Typography } from "@mui/material";

interface BarChartProps {
  data: number[];
  labels: string[];
}

const BarChart: React.FC<BarChartProps> = ({ data, labels }) => {
  const maxValue = Math.max(...data, 1);

  return (
    <Box
      display="flex"
      alignItems="flex-end"
      justifyContent="center"
      height="100px"
      gap={1}
      padding="8px"
    >
      {data.map((value, index) => (
        <Box
          key={index}
          display="flex"
          flexDirection="column"
          alignItems="center"
          flex={1}
        >
          {/* Столбик */}
          <Box
            sx={{
              height: `${(value / maxValue) * 100}%`,
              width: "20px",
              background: "linear-gradient(180deg, #9C27B0 0%, #7B1FA2 100%)",
              borderRadius: "4px",
              transition: "height 0.3s ease, transform 0.2s ease",
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          />
          {/* Подпись */}
          <Typography
            variant="caption"
            sx={{ marginTop: "6px", color: "#ccc", whiteSpace: "nowrap" }}
          >
            {labels[index]}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default BarChart;
