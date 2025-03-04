import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

interface KPIItemProps {
  title: string;
  value: number;
}

const KPIItem: React.FC<KPIItemProps> = ({ title, value }) => {
  return (
    <Card sx={{ backgroundColor: "#333", color: "#fff" }}>
      <CardContent sx={{ py: 1 }}>
        <Typography variant="subtitle1" sx={{ opacity: 0.7, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default KPIItem;
