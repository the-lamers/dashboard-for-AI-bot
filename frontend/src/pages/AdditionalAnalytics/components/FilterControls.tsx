import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";


export const FilterControls = ({
  campusesDataRaw,
  educationDataRaw,
  questionCategoriesDataRaw,
  selectedCampus,
  setSelectedCampus,
  selectedEducation,
  setSelectedEducation,
  selectedCategory,
  setSelectedCategory
}) => {
  return (
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
  );
};