import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  items: { name: string }[];
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  value,
  onChange,
  items,
}) => {
  return (
    <FormControl
      fullWidth
      variant="outlined"
      sx={{
        backgroundColor: "#2c2c2c",
        borderRadius: 1,
        opacity: 1, // Убедитесь, что FormControl полностью непрозрачен
      }}
    >
      <InputLabel sx={{ color: "#bbb", opacity: 1 }}>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          color: "#fff",
          opacity: 1, // Убедитесь, что Select полностью непрозрачен
          backgroundColor: "#2c2c2c",
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: "#666",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
          },
          ".MuiSvgIcon-root": {
            fill: "#fff",
            opacity: 1, // Убедитесь, что иконка полностью непрозрачна
          },
          "& .MuiPaper-root": {
            backgroundColor: "#2c2c2c !important",
            opacity: 1, // Убедитесь, что выпадающее меню полностью непрозрачно
          },
          "& .MuiMenu-paper": {
            backgroundColor: "#2c2c2c !important",
            opacity: 1, // Убедитесь, что меню полностью непрозрачно
          },
        }}
      >
        <MenuItem value="all">Все</MenuItem>
        {items.map((item) => (
          <MenuItem key={item.name} value={item.name}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};