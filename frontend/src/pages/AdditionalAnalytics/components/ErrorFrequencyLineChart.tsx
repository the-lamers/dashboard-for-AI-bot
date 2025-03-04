import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

export const ErrorFrequencyLineChart = ({ data }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          Частота ошибок модели
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <XAxis dataKey="date" stroke="#E0E0E0" />
            <YAxis stroke="#E0E0E0" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="errors" stroke="#FF6D00" dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};