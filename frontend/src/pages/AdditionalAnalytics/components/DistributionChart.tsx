import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


export const DistributionChart = ({ title, data, fillColor }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#E0E0E0" />
            <YAxis stroke="#E0E0E0" />
            <Tooltip />
            <Bar dataKey="value" fill={fillColor} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};