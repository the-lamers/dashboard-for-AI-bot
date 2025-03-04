import React, { useEffect, useState } from "react";
import { Typography, Box, Container, Grid, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { fetchMetrics } from "../../api/metricsAPI";
import UnifiedBarChart from "../../components/UnifiedBarChart";
import QuestionCategories from "./components/QuestionCategories";
import RepeatedQuestions from "./components/RepeatedQuestions";

const MetricsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMetrics().then((res) => {
      setMetrics(res.metrics);
    });
  }, []);

  if (!metrics) return <Typography>Загрузка данных...</Typography>;

  const campusesData = Object.entries(metrics.campuses).map(([campus, count]) => ({
    name: campus,
    count,
  }));

  const educationLevelsData = Object.entries(metrics.educationLevels).map(([level, count]) => ({
    name: level,
    count,
  }));

  const questionCategoriesData = Object.entries(metrics.questionCategories).map(([category, count]) => ({
    category,
    count,
  }));

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        p: 2,
      }}
    >
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Grid container spacing={4}>
            
            {/* Графики */}
            <Grid item xs={12} md={6}>
              <UnifiedBarChart
                title="Кампусы"
                data={campusesData}
                fillColor="#2979FF"
                dataKey="count"
                interactive={false}
                showGrid={true}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <UnifiedBarChart
                title="Уровни образования"
                data={educationLevelsData}
                fillColor="#FFC107"
                dataKey="count"
                interactive={false}
                showGrid={true}
              />
            </Grid>
            <Grid item xs={12}>
              <QuestionCategories questionCategoriesData={questionCategoriesData} />
            </Grid>
            <Grid item xs={12}>
              <RepeatedQuestions
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                repeatedQuestions={metrics.chatHistory.repeatedQuestions}
              />
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default MetricsDashboard;
