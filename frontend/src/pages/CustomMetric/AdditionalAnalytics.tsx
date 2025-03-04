import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
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

  // Применяем фильтры (filters – фильтры)
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

      {/* Фильтры */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="campus-select-label">Кампус</InputLabel>
            <Select
              labelId="campus-select-label"
              value={selectedCampus}
              label="Кампус"
              onChange={(e) => setSelectedCampus(e.target.value)}
            >
              <MenuItem value="all">Все</MenuItem>
              {campusesDataRaw.map((item) => (
                <MenuItem key={item.name} value={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="education-select-label">Уровень образования</InputLabel>
            <Select
              labelId="education-select-label"
              value={selectedEducation}
              label="Уровень образования"
              onChange={(e) => setSelectedEducation(e.target.value)}
            >
              <MenuItem value="all">Все</MenuItem>
              {educationDataRaw.map((item) => (
                <MenuItem key={item.name} value={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="category-select-label">Категория вопросов</InputLabel>
            <Select
              labelId="category-select-label"
              value={selectedCategory}
              label="Категория вопросов"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="all">Все</MenuItem>
              {questionCategoriesDataRaw.map((item) => (
                <MenuItem key={item.name} value={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Графики распределения, удовлетворённости, ошибок и анализа галлюцинаций */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                Распределение по кампусам
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={campusesData}>
                  <XAxis dataKey="name" stroke="#E0E0E0" />
                  <YAxis stroke="#E0E0E0" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#00E676" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                Распределение по уровням образования
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={educationData}>
                  <XAxis dataKey="name" stroke="#E0E0E0" />
                  <YAxis stroke="#E0E0E0" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2979FF" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                Распределение по категориям вопросов
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={questionCategoriesData}>
                  <XAxis dataKey="name" stroke="#E0E0E0" />
                  <YAxis stroke="#E0E0E0" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#FF5252" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                Пользовательская удовлетворённость
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={satisfactionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {satisfactionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={["#00C853", "#FFD600", "#D50000"][index % 3]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                Частота ошибок модели
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={errorFrequencyData}>
                  <XAxis dataKey="date" stroke="#E0E0E0" />
                  <YAxis stroke="#E0E0E0" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="errors" stroke="#FF6D00" dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                Анализ галлюцинаций модели
              </Typography>
              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                Текущий уровень галлюцинаций: {(metrics.hallucinationMetric.currentValue * 100).toFixed(2)}%
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={metrics.hallucinationMetric.history}>
                  <XAxis dataKey="date" stroke="#E0E0E0" />
                  <YAxis stroke="#E0E0E0" domain={[0, 1]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8E24AA" dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Параметр</TableCell>
                      <TableCell>Значение</TableCell>
                      <TableCell>Комментарий</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {metrics.hallucinationMetric.details.map((detail, index) => (
                      <TableRow key={index}>
                        <TableCell>{detail.parameter}</TableCell>
                        <TableCell>{detail.value}</TableCell>
                        <TableCell>{detail.comment}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdditionalAnalytics;
