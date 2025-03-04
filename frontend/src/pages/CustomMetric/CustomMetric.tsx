import React, { useEffect, useState } from "react";
import { 
  Card, CardContent, Typography, Button, Modal, Box, Grid, 
  Paper, Switch, FormControlLabel, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow 
} from "@mui/material";
import { fetchMetrics } from "../../api/metricsAPI";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid, Legend 
} from "recharts";

interface CustomMetricData {
  customMetricValue: number;
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

const thresholdData = [
  { name: "Минимум", value: 0.3 },
  { name: "Оптимум", value: 0.65 },
  { name: "Максимум", value: 1.0 }
];

const historyData = [
  { date: "2025-03-01", value: 0.6 },
  { date: "2025-03-05", value: 0.62 },
  { date: "2025-03-10", value: 0.64 },
  { date: "2025-03-15", value: 0.66 },
  { date: "2025-03-20", value: 0.65 }
];

const detailRows = [
  { parameter: "Количество фрагментов", detail: "3", comment: "Больше фрагментов может ухудшать контекст" },
  { parameter: "Похожесть документов", detail: "0.8", comment: "Высокая похожесть – риск путаницы" },
  { parameter: "Убедительность ответа", detail: "0.9", comment: "Слишком высокая убедительность может скрывать ошибку" }
];

const CustomMetric: React.FC = () => {
  const [metric, setMetric] = useState<CustomMetricData>({ customMetricValue: 0 });
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchMetrics().then((res) => {
      setMetric(res.customMetric);
    });
  }, []);

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", p: 3, boxSizing: "border-box" }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <Grid container spacing={3} justifyContent="center">
          {/* Используем xs=12 для полного охвата ширины */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" align="center" sx={{ mb: 2 }}>
                  Дополнительная метрика
                </Typography>
                <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                  Значение: {metric.customMetricValue.toFixed(2)}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" align="center" sx={{ mb: 2 }}>
                        Сравнение с пороговыми значениями
                      </Typography>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={thresholdData}>
                          <XAxis dataKey="name" stroke="#E0E0E0" />
                          <YAxis stroke="#E0E0E0" />
                          <Tooltip contentStyle={{ backgroundColor: "#333", borderRadius: "8px", border: "none" }} />
                          <Bar dataKey="value" fill="#00E676" isAnimationActive={true} animationDuration={1500} />
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
                        <LineChart data={historyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                          <XAxis dataKey="date" stroke="#E0E0E0" />
                          <YAxis stroke="#E0E0E0" />
                          <Tooltip contentStyle={{ backgroundColor: "#333", borderRadius: "8px", border: "none" }} />
                          <Legend />
                          <Line type="monotone" dataKey="value" stroke="#00E676" activeDot={{ r: 8 }} isAnimationActive={true} animationDuration={1500} />
                        </LineChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch checked={showDetails} onChange={(e) => setShowDetails(e.target.checked)} color="secondary" />
                    }
                    label="Показать подробности"
                  />
                  {showDetails && (
                    <TableContainer component={Paper} sx={{ mt: 2, background: 'rgba(255,255,255,0.05)' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Параметр</TableCell>
                            <TableCell>Значение</TableCell>
                            <TableCell>Комментарий</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {detailRows.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{row.parameter}</TableCell>
                              <TableCell>{row.detail}</TableCell>
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
            Пользовательская метрика
          </Typography>
          <Typography variant="body1">
            Эта метрика оценивает ситуацию, когда в контекст пришли несколько фрагментов документов, но модель начала путать понятия и дала убедительный, но неверный ответ. Высокое значение метрики указывает на повышенный риск путаницы, что требует дополнительного контроля.
          </Typography>
          <Button onClick={() => setOpen(false)} sx={{ mt: 2 }} variant="contained" color="secondary">
            Закрыть
          </Button>
        </motion.div>
      </Modal>
    </Box>
  );
};

export default CustomMetric;
