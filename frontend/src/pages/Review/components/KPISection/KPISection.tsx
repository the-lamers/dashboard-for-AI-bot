import React from "react";
import { Grid } from "@mui/material";
import KPIItem from "./KPIItem"; 

interface KPISectionProps {
  totalCampuses: number;
  totalEduLevels: number;
  totalQuestionCats: number;
}

const KPISection: React.FC<KPISectionProps> = ({
  totalCampuses,
  totalEduLevels,
  totalQuestionCats
}) => {
  return (
    <Grid container spacing={1} sx={{ mb: 1 }}>
      <Grid item xs={12} md={4}>
        <KPIItem title="Количество кампусов" value={totalCampuses} />
      </Grid>
      <Grid item xs={12} md={4}>
        <KPIItem title="Уровней образования" value={totalEduLevels} />
      </Grid>
      <Grid item xs={12} md={4}>
        <KPIItem title="Категорий вопросов" value={totalQuestionCats} />
      </Grid>
    </Grid>
  );
};

export default KPISection;
