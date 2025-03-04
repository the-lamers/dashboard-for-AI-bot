import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import MetricsOverview from "./components/MetricsOverview";
import AnimatedLineChart from "./components/AnimatedLineChart";
import AnimatedTable from "./components/AnimatedTable";

const Dashboard: React.FC = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5">Обзор метрик</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <MetricsOverview />
      </Grid>
      <Grid item xs={12} md={6}>
        <AnimatedLineChart />
      </Grid>
      <Grid item xs={12} md={6}>
        <AnimatedTable />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
