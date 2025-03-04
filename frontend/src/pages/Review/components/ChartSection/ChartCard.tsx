import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import BarChart from "./BarChart";

interface ChartCardProps {
  title: string;
  data: number[];
  labels: string[];
}

const ChartCard: React.FC<ChartCardProps> = ({ title, data, labels }) => {
  return (
    <Card sx={{ backgroundColor: "#333", color: "#fff" }}>
      <CardContent sx={{ py: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.25 }}>
          {title}
        </Typography>
        <BarChart data={data} labels={labels} sx={{ mt: 0 }} />
      </CardContent>
    </Card>
  );
};

export default ChartCard;
