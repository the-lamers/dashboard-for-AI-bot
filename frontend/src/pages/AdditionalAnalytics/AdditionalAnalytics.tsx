import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { DistributionChart } from "./components/DistributionChart";
import { ErrorFrequencyLineChart } from "./components/ErrorFrequencyLineChart";
import { FilterControls } from "./components/FilterControls";
import { HallucinationAnalysis } from "./components/HallucinationAnalysis";
import { SatisfactionPieChart } from "./components/SatisfactionPieChart";

import axios from "axios";


const AdditionalAnalytics = () => {
  const [metrics, setMetrics] = useState(null);
  const [satisfactionData, setSatisfactionData] = useState([]);
  const [errorFrequencyData, setErrorFrequencyData] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState("all");
  const [selectedEducation, setSelectedEducation] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    axios.get("http://localhost:5000/api/metrics").then((res) => {
      setMetrics(res.data);
      setSatisfactionData([
        { name: "Очень удовлетворён", value: 70 },
        { name: "Удовлетворён", value: 20 },
        { name: "Не удовлетворён", value: 10 }
      ]);
      setErrorFrequencyData([
        { date: "2025-03-01", errors: 5 },
        { date: "2025-03-05", errors: 7 },
        { date: "2025-03-10", errors: 6 },
        { date: "2025-03-15", errors: 8 },
        { date: "2025-03-20", errors: 5 }
      ]);
    });
  }, []);

  if (!metrics) return <Typography>Загрузка...</Typography>;

  const campusesDataRaw = Object.keys(metrics.campuses).map((key) => ({
    name: key,
    value: metrics.campuses[key]
  }));
  const educationDataRaw = Object.keys(metrics.educationLevels).map((key) => ({
    name: key,
    value: metrics.educationLevels[key]
  }));
  const questionCategoriesDataRaw = Object.keys(metrics.questionCategories).map((key) => ({
    name: key,
    value: metrics.questionCategories[key]
  }));

  const campusesData =
    selectedCampus === "all"
      ? campusesDataRaw
      : campusesDataRaw.filter((item) => item.name === selectedCampus);
  const educationData =
    selectedEducation === "all"
      ? educationDataRaw
      : educationDataRaw.filter((item) => item.name === selectedEducation);
  const questionCategoriesData =
    selectedCategory === "all"
      ? questionCategoriesDataRaw
      : questionCategoriesDataRaw.filter((item) => item.name === selectedCategory);

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Typography variant="h4" align="center" sx={{ mb: 3 }}>
        Аналитика данных
      </Typography>
      <FilterControls
        campusesDataRaw={campusesDataRaw}
        educationDataRaw={educationDataRaw}
        questionCategoriesDataRaw={questionCategoriesDataRaw}
        selectedCampus={selectedCampus}
        setSelectedCampus={setSelectedCampus}
        selectedEducation={selectedEducation}
        setSelectedEducation={setSelectedEducation}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <DistributionChart title="Распределение по кампусам" data={campusesData} fillColor="#00E676" />
        </Grid>
        <Grid item xs={12} md={4}>
          <DistributionChart title="Распределение по уровням образования" data={educationData} fillColor="#2979FF" />
        </Grid>
        <Grid item xs={12} md={4}>
          <DistributionChart title="Распределение по категориям вопросов" data={questionCategoriesData} fillColor="#FF5252" />
        </Grid>
        <Grid item xs={12} md={6}>
          <SatisfactionPieChart data={satisfactionData} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ErrorFrequencyLineChart data={errorFrequencyData} />
        </Grid>
        <Grid item xs={12}>
          <HallucinationAnalysis metrics={metrics} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdditionalAnalytics;
