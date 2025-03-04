import React from "react";
import { Box, Typography, Tooltip, Paper } from "@mui/material";

interface BarChartProps {
  data: number[];
  labels: string[];
  maxBarHeight?: number; // Возможность управлять высотой диаграммы
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  labels,
  maxBarHeight = 160,
}) => {
  // Находим максимум для пропорционального вычисления высоты столбцов
  const maxValue = Math.max(...data, 1);

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        width: "100%",
        overflowX: "auto",
      }}
      elevation={3}
    >
      <Box
        display="flex"
        alignItems="flex-end"
        gap={3}
        sx={{
          height: maxBarHeight,
          minWidth: data.length * 60, // Минимальная ширина зависит от количества столбиков
          pb: 2,
        }}
      >
        {data.map((value, index) => {
          const barHeightPercent = (value / maxValue) * 100;

          return (
            <Box
              key={index}
              display="flex"
              flexDirection="column"
              alignItems="center"
              width="40px"
              flex="none"
              sx={{
                // При наведении добавляем масштаб и тень
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 12px rgba(255,255,255,0.2)",
                },
              }}
            >
              <Tooltip
                title={
                  <Typography variant="body2" sx={{ color: "#fff" }}>
                    {`${labels[index]}: ${value}`}
                  </Typography>
                }
                arrow
                placement="top"
              >
                <Box
                  sx={{
                    height: `${barHeightPercent}%`,
                    width: "100%",
                    borderRadius: "8px 8px 0 0",
                    background: "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    transition: "height 0.3s ease",
                  }}
                />
              </Tooltip>
              {/* Подпись для столбца */}
              <Box
                sx={{
                  mt: 1,
                  px: 1,
                  py: 0.5,
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(5px)",
                  maxWidth: "80px",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#fff",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={labels[index]} // Полный текст при наведении
                >
                  {labels[index]}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default BarChart;
