import React from "react";
import { Card, CardContent, Typography, TextField, Grid, Paper } from "@mui/material";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";

const COLORS = ["#00E676", "#7B1FA2", "#FF4081", "#2979FF", "#FFC107"];

interface RepeatedQuestion {
  question: string;
  count: number;
}

interface RepeatedQuestionsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  repeatedQuestions: RepeatedQuestion[];
}

const RepeatedQuestions: React.FC<RepeatedQuestionsProps> = ({
  searchQuery,
  setSearchQuery,
  repeatedQuestions,
}) => {
  const filteredQuestions = repeatedQuestions.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h5" align="center" sx={{ mb: 2 }}>
          Повторения вопросов
        </Typography>
        <TextField
          label="Поиск по вопросам"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          sx={{ mb: 3 }}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                Диаграмма повторений
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={filteredQuestions}
                    dataKey="count"
                    nameKey="question"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {filteredQuestions.map((entry, index) => (
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
            <Paper sx={{
              p: 2,
              maxHeight: 300,
              overflowY: "auto",
              background: "rgba(0,0,0,0.05)",
            }}>
              <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                Таблица повторений
              </Typography>
              {filteredQuestions.length === 0 ? (
                <Typography align="center">Нет данных</Typography>
              ) : (
                filteredQuestions.map((item, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 1,
                      mb: 1,
                      background: "rgba(255,255,255,0.05)",
                    }}
                  >
                    <Typography>
                      <strong>{item.question}</strong>: {item.count}
                    </Typography>
                  </Paper>
                ))
              )}
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default RepeatedQuestions;
