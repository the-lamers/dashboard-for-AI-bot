import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { FilterSelect } from "./FilterSelect";

interface FilterControlsProps {
  campusesDataRaw: { name: string }[];
  educationDataRaw: { name: string }[];
  questionCategoriesDataRaw: { name: string }[];
  selectedCampus: string;
  setSelectedCampus: (value: string) => void;
  selectedEducation: string;
  setSelectedEducation: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  campusesDataRaw,
  educationDataRaw,
  questionCategoriesDataRaw,
  selectedCampus,
  setSelectedCampus,
  selectedEducation,
  setSelectedEducation,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 3,
        backgroundColor: "#1e1e1e",
        borderRadius: 2,
        opacity: 1, // Убедитесь, что Paper полностью непрозрачен
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: "#fff", opacity: 1 }}>
        Фильтры
      </Typography>
      <Grid container spacing={3} sx={{ opacity: 1 }}>
        <Grid item xs={12} md={4} sx={{ opacity: 1 }}>
          <FilterSelect
            label="Кампус"
            value={selectedCampus}
            onChange={setSelectedCampus}
            items={campusesDataRaw}
          />
        </Grid>
        <Grid item xs={12} md={4} sx={{ opacity: 1 }}>
          <FilterSelect
            label="Уровень образования"
            value={selectedEducation}
            onChange={setSelectedEducation}
            items={educationDataRaw}
          />
        </Grid>
        <Grid item xs={12} md={4} sx={{ opacity: 1 }}>
          <FilterSelect
            label="Категория вопросов"
            value={selectedCategory}
            onChange={setSelectedCategory}
            items={questionCategoriesDataRaw}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};