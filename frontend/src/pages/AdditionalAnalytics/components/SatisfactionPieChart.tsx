import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export const SatisfactionPieChart = ({ data }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          Пользовательская удовлетворённость
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={["#00C853", "#FFD600", "#D50000"][index % 3]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};