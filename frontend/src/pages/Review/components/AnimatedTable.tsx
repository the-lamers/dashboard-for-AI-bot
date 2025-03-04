import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Card,
  CardContent
} from "@mui/material";
import { motion } from "framer-motion";

interface MetricRow {
  metric: string;
  value: string | number;
}

const rows: MetricRow[] = [
  { metric: "Среднее время ответа", value: "3.29 сек." },
  { metric: "Пустой chat_history", value: "70%" },
  { metric: "Непустой chat_history", value: "30%" },
  { metric: "Пользовательская метрика", value: "0.65" }
];

const AnimatedTable: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Показатели производительности
        </Typography>
        <TableContainer component={Paper} sx={{ background: 'rgba(255,255,255,0.1)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Метрика</TableCell>
                <TableCell align="right">Значение</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TableCell component="th" scope="row">
                    {row.metric}
                  </TableCell>
                  <TableCell align="right">{row.value}</TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default AnimatedTable;
