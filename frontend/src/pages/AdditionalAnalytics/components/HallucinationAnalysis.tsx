import {
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
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

export const HallucinationAnalysis = ({ metrics }) => {
  const hallucinationMetric = metrics.hallucinationMetric || {
    currentValue: 0,
    history: [],
    details: []
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          Анализ галлюцинаций модели
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
          Текущий уровень галлюцинаций: {(hallucinationMetric.currentValue * 100).toFixed(2)}%
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={hallucinationMetric.history}>
            <XAxis dataKey="date" stroke="#E0E0E0" />
            <YAxis stroke="#E0E0E0" domain={[0, 1]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8E24AA" dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Параметр</TableCell>
                <TableCell>Значение</TableCell>
                <TableCell>Комментарий</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hallucinationMetric.details.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell>{detail.parameter}</TableCell>
                  <TableCell>{detail.value}</TableCell>
                  <TableCell>{detail.comment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
