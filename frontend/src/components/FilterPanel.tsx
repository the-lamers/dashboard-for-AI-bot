import React, { useState } from "react";
import { Box, TextField, Button, Grid } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const FilterPanel: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [campus, setCampus] = useState("");

  const handleFilter = () => {
    console.log("Применён фильтр", startDate, endDate, campus);
  };

  return (
    <Box sx={{ mb: 2, p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <DatePicker
              label="Начальная дата"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DatePicker
              label="Конечная дата"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Кампус"
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Button variant="contained" color="secondary" onClick={handleFilter}>
              Фильтр
            </Button>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Box>
  );
};

export default FilterPanel;
