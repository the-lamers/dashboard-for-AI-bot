import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { fetchMetrics } from "../../../api/metricsAPI";
import KPISection from "./KPISection/KPISection";
import ChartsSection from "./ChartSection/ChartsSection";

interface MetricsData {
  campuses: { [key: string]: number };
  educationLevels: { [key: string]: number };
  questionCategories: { [key: string]: number };
}

const MetricsOverview: React.FC = () => {
  const [data, setData] = useState<MetricsData>({
    campuses: { Москва: 0, "Нижний Новгород": 0, "Санкт-Петербург": 0, Пермь: 0 },
    educationLevels: { бакалавриат: 0, магистратура: 0, специалитет: 0, аспирантура: 0 },
    questionCategories: {}
  });

  useEffect(() => {
    fetchMetrics().then((res) => {
      setData(res);
    });
  }, []);

  const totalCampuses = Object.keys(data.campuses).length;
  const totalEduLevels = Object.keys(data.educationLevels).length;
  const totalQuestionCats = Object.keys(data.questionCategories).length;

  return (
    <Box
      sx={{ p: 2, background: "linear-gradient(to right, #232526, #414345)" }}
    >
      <KPISection
        totalCampuses={totalCampuses}
        totalEduLevels={totalEduLevels}
        totalQuestionCats={totalQuestionCats}
      />
      <ChartsSection
        campuses={data.campuses}
        educationLevels={data.educationLevels}
        questionCategories={data.questionCategories}
      />
    </Box>
  );
};

export default MetricsOverview;
