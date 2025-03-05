import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import axios from "axios";

import UnifiedBarChart from "../../components/UnifiedBarChart";
import { FilterControls } from "./components/FilterControls";
import { SatisfactionPieChart } from "./components/SatisfactionPieChart";
import { ErrorFrequencyLineChart } from "./components/ErrorFrequencyLineChart";
import { HallucinationAnalysis } from "./components/HallucinationAnalysis";

const AdditionalAnalytics = () => {
  const [data, setData] = useState(null);

  const [selectedCampus, setSelectedCampus] = useState("all");
  const [selectedEducation, setSelectedEducation] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Формируем объект с параметрами фильтров
        const params = {};
        if (selectedCampus !== "all") params.campus = selectedCampus;
        if (selectedEducation !== "all") params.education = selectedEducation;
        if (selectedCategory !== "all") params.category = selectedCategory;

        // Отправляем GET-запрос с параметрами
        const res = await axios.get("http://localhost:5000/api/metrics", { params });

        // Сохраняем весь объект данных в стейт
        setData(res.data);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, [selectedCampus, selectedEducation, selectedCategory]);

  if (!data) {
    return <Typography>Загрузка...</Typography>;
  }

  // Если на бэкенде для кампусов/уровней/категорий возвращается объект, преобразуем его в массив
  const campusesDataRaw = data.campuses
    ? Object.keys(data.campuses).map((key) => ({
        name: key,
        value: data.campuses[key],
      }))
    : [];

  const educationDataRaw = data.educationLevels
    ? Object.keys(data.educationLevels).map((key) => ({
        name: key,
        value: data.educationLevels[key],
      }))
    : [];

  const questionCategoriesDataRaw = data.questionCategories
    ? Object.keys(data.questionCategories).map((key) => ({
        name: key,
        value: data.questionCategories[key],
      }))
    : [];

  // Список данных для диаграммы удовлетворённости (если сервер не вернул, берём дефолтные)
  const satisfactionData = data.satisfactionData || [
    { name: "Очень удовлетворён", value: 70 },
    { name: "Удовлетворён", value: 20 },
    { name: "Не удовлетворён", value: 10 },
  ];

  // Список данных для частоты ошибок (если сервер не вернул, берём дефолтные)
  const errorFrequencyData = data.errorFrequencyData || [
    { date: "2025-03-01", errors: 5 },
    { date: "2025-03-05", errors: 7 },
    { date: "2025-03-10", errors: 6 },
    { date: "2025-03-15", errors: 8 },
    { date: "2025-03-20", errors: 5 },
  ];

  // Фильтруем (filter) данные только если выбран конкретный кампус/уровень/категория
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
        {/* Распределение по кампусам */}
        <Grid item xs={12} md={4} sx={{ display: "flex" }}>
          <UnifiedBarChart
            title="Распределение по кампусам"
            data={campusesData}
            fillColor="#00E676"
            dataKey="value"
            interactive
          />
        </Grid>

        {/* Распределение по уровням образования */}
        <Grid item xs={12} md={4} sx={{ display: "flex" }}>
          <UnifiedBarChart
            title="Распределение по уровням образования"
            data={educationData}
            fillColor="#2979FF"
            dataKey="value"
            interactive
          />
        </Grid>

        {/* Распределение по категориям вопросов */}
        <Grid item xs={12} md={4} sx={{ display: "flex" }}>
          <UnifiedBarChart
            title="Распределение по категориям вопросов"
            data={questionCategoriesData}
            fillColor="#FF5252"
            dataKey="value"
            interactive
          />
        </Grid>

        {/* Пирог (pie) удовлетворённости */}
        <Grid item xs={12} md={6}>
          <SatisfactionPieChart data={satisfactionData} />
        </Grid>

        {/* Линия (line) частоты ошибок */}
        <Grid item xs={12} md={6}>
          <ErrorFrequencyLineChart data={errorFrequencyData} />
        </Grid>

        {/* Анализ галлюцинаций */}
        <Grid item xs={12}>
          <HallucinationAnalysis metrics={data} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdditionalAnalytics;
