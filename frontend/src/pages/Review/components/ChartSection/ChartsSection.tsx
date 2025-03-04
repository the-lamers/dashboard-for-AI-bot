import React from "react";
import { Grid } from "@mui/material";
import ChartCard from "./ChartCard";

interface ChartsSectionProps {
  campuses: { [key: string]: number };
  educationLevels: { [key: string]: number };
  questionCategories: { [key: string]: number };
}

const ChartsSection: React.FC<ChartsSectionProps> = ({
  campuses,
  educationLevels,
  questionCategories
}) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={4}>
        <ChartCard
          title="Распределение по кампусам"
          data={Object.values(campuses)}
          labels={Object.keys(campuses)}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <ChartCard
          title="Уровни образования"
          data={Object.values(educationLevels)}
          labels={Object.keys(educationLevels)}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <ChartCard
          title="Категории вопросов"
          data={Object.values(questionCategories)}
          labels={Object.keys(questionCategories)}
        />
      </Grid>
    </Grid>
  );
};

export default ChartsSection;
