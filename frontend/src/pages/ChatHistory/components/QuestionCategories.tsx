import React from "react";
import { Card, CardContent, Typography, Grid, Paper } from "@mui/material";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";

const COLORS = ["#00E676", "#7B1FA2", "#FF4081", "#2979FF", "#FFC107"];

interface QuestionCategory {
  category: string;
  count: number;
}

interface QuestionCategoriesProps {
  questionCategoriesData: QuestionCategory[];
}

const QuestionCategories: React.FC<QuestionCategoriesProps> = ({ questionCategoriesData }) => {
  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h5" align="center" sx={{ mb: 2 }}>
          Категория вопросов
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={questionCategoriesData}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {questionCategoriesData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{
                    backgroundColor: "#333",
                    borderRadius: "8px",
                    border: "none",
                  }} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, maxHeight: 300, overflowY: "auto" }}>
              {questionCategoriesData.map((item, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 1,
                    mb: 1,
                    background: "rgba(255,255,255,0.05)",
                  }}
                >
                  <Typography>
                    <strong>{item.category}</strong>: {item.count}
                  </Typography>
                </Paper>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuestionCategories;
