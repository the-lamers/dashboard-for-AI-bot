import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Switch,
  FormControlLabel
} from "@mui/material";
import { motion } from "framer-motion";
import { fetchMetrics } from "../../api/metricsAPI";
import ThresholdChart from "./components/ThresholdChart";
import HistoryChart from "./components/HistoryChart";
import DetailsTable from "./components/DetailsTable";
import MetricModal from "./components/MetricModal";

interface HallucinationMetricData {
  currentValue: number;
  history: { date: string; value: number }[];
  details: { parameter: string; value: number; comment: string }[];
}

// Данные для пороговых значений
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
                    <ThresholdChart data={thresholdData} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <HistoryChart data={metric.history} />
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
                  {showDetails && <DetailsTable details={metric.details} />}
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
      <MetricModal open={open} handleClose={() => setOpen(false)} />
    </Box>
  );
};

export default HallucinationMetric;
