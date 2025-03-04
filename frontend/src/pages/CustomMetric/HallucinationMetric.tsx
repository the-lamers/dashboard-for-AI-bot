import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Modal,
  Box,
  Grid,
  Paper,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { fetchMetrics } from "../../api/metricsAPI";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from "recharts";

interface HallucinationMetricData {
  currentValue: number;
  history: { date: string; value: number }[];
  details: { parameter: string; value: number; comment: string }[];
}

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  textAlign: "center"
};

// Пороговые значения для визуального сравнения (настраиваются по необходимости)
const thresholdData = [
  { name: "Низкий", value: 0.10 },
  { name: "Средний", value: 0.15 },
  { name: "Высокий", value: 0.20 }
];

const HallucinationMetric: React.FC = () => {
  const [metric, setMetric] = useState<HallucinationMetricData | null>(null);
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchMetrics().then((res) => {
      setMetric(res.hallucinationMetric);
    });
  }, []);

  if (!metric) {
    return <Typography>Загрузка...</Typography>;
  }

  return (
    <Box sx={{ width: "auto", minHeight: "100vh", p: 3, boxSizing: "border-box" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" align="center" sx={{ mb: 2 }}>
                  Мониторинг галлюцинаций
                </Typography>
                <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                  Текущий уровень: {(metric.currentValue * 100).toFixed(2)}%
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" align="center" sx={{ mb: 2 }}>
                        Пороговые значения
                      </Typography>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={thresholdData}>
                          <XAxis dataKey="name" stroke="#E0E0E0" />
                          <YAxis stroke="#E0E0E0" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#333",
                              borderRadius: "8px",
                              border: "none"
                            }}
                          />
                          <Bar
                            dataKey="value"
                            fill="#FF5252"
                            isAnimationActive={true}
                            animationDuration={1500}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" align="center" sx={{ mb: 2 }}>
                        История метрики
                      </Typography>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart
                          data={metric.history}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                          <XAxis dataKey="date" stroke="#E0E0E0" />
                          <YAxis stroke="#E0E0E0" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#333",
                              borderRadius: "8px",
                              border: "none"
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#FF5252"
                            activeDot={{ r: 8 }}
                            isAnimationActive={true}
                            animationDuration={1500}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showDetails}
                        onChange={(e) => setShowDetails(e.target.checked)}
                        color="secondary"
                      />
                    }
                    label="Показать подробности"
                  />
                  {showDetails && (
                    <TableContainer
                      component={Paper}
                      sx={{ mt: 2, background: 'rgba(255,255,255,0.05)' }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Параметр</TableCell>
                            <TableCell>Значение</TableCell>
                            <TableCell>Комментарий</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {metric.details.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{row.parameter}</TableCell>
                              <TableCell>{row.value}</TableCell>
                              <TableCell>{row.comment}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <Button variant="outlined" color="secondary" onClick={() => setOpen(true)}>
                    Что это за метрика?
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={modalStyle}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Мониторинг галлюцинаций
          </Typography>
          <Typography variant="body1">
            Эта метрика отслеживает процент некорректных ответов модели (галлюцинаций) в онлайн-режиме. Расчёт производится с учетом сравнения с эталоном, анализа логической связности и эвристики ключевых слов.
          </Typography>
          <Button onClick={() => setOpen(false)} sx={{ mt: 2 }} variant="contained" color="secondary">
            Закрыть
          </Button>
        </motion.div>
      </Modal>
    </Box>
  );
};

export default HallucinationMetric;

