import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Tooltip, Paper } from "@mui/material";
import { fetchMetrics } from "../../api/metricsAPI";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip } from "recharts";
import { motion } from "framer-motion";

interface PerformanceData {
  averageResponseTime: number;
  emptyChatHistoryFrequency: number;
  nonEmptyChatHistoryFrequency: number;
}

const data = [
  { time: "10:00", responseTime: 3.5 },
  { time: "10:05", responseTime: 3.2 },
  { time: "10:10", responseTime: 3.8 },
  { time: "10:15", responseTime: 3.1 },
  { time: "10:20", responseTime: 3.0 }
];

const PerformanceMetrics: React.FC = () => {
  const [perfData, setPerfData] = useState<PerformanceData>({
    averageResponseTime: 0,
    emptyChatHistoryFrequency: 0,
    nonEmptyChatHistoryFrequency: 0
  });

  useEffect(() => {
    fetchMetrics().then((res) => {
      setPerfData(res.performance);
    });
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" align="center" sx={{ mb: 2 }}>Общая производительность</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <Tooltip title="Среднее время обработки вопроса моделью">
                    <Paper sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="subtitle1">Среднее время ответа</Typography>
                      <Typography variant="h6">{perfData.averageResponseTime.toFixed(2)} сек.</Typography>
                    </Paper>
                  </Tooltip>
                </Grid>
                {/* <Grid item xs={12} md={4}>
                  <Tooltip title="Пустой chat_history означает, что пользователь не задал уточняющий вопрос">
                    <Paper sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="subtitle1">Пустой chat_history</Typography>
                      <Typography variant="h6">{perfData.emptyChatHistoryFrequency}%</Typography>
                    </Paper>
                  </Tooltip>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Tooltip title="Непустой chat_history означает, что пользователь задал уточняющий вопрос">
                    <Paper sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="subtitle1">Непустой chat_history</Typography>
                      <Typography variant="h6">{perfData.nonEmptyChatHistoryFrequency}%</Typography>
                    </Paper>
                  </Tooltip>
                </Grid> */}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="center" gutterBottom>
                Динамика среднего времени ответа
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="time" stroke="#E0E0E0" />
                  <YAxis stroke="#E0E0E0" />
                  <ReTooltip contentStyle={{ backgroundColor: '#333', borderRadius: '8px', border: 'none' }} />
                  <Line type="monotone" dataKey="responseTime" stroke="#00E676" activeDot={{ r: 8 }} isAnimationActive={true} animationDuration={1500} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default PerformanceMetrics;
