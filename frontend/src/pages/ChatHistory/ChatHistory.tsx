import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Paper,
  Container
} from "@mui/material";
import { fetchMetrics } from "../../api/metricsAPI";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

interface ChatItem {
  question: string;
  count: number;
}

interface ChatData {
  repeatedQuestions: ChatItem[];
}

const COLORS = ["#00E676", "#7B1FA2", "#FF4081", "#2979FF", "#FFC107"];

const ChatHistory: React.FC = () => {
  const [chatData, setChatData] = useState<ChatData>({ repeatedQuestions: [] });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMetrics().then((res) => {
      setChatData(res.chatHistory);
    });
  }, []);

  const filteredQuestions = chatData.repeatedQuestions.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth={false} sx={{ p: 2 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%" }}
      >
        <Grid container spacing={2} sx={{ width: "100%" }}>
          <Grid item xs={12}>
            <Card sx={{ width: "100%", p: 2, mb: 2 }}>
              <CardContent>
                <Typography variant="h5" align="center" sx={{ mb: 2 }}>
                  История чатов
                </Typography>
                <TextField
                  label="Поиск по вопросам"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                  sx={{ mb: 3 }}
                />
                <Grid container spacing={2} sx={{ width: "100%" }}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, width: "100%" }}>
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
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: "#333", borderRadius: "8px", border: "none" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, maxHeight: 300, overflowY: "auto", width: "100%" }}>
                      <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                        Таблица повторений
                      </Typography>
                      {filteredQuestions.length === 0 ? (
                        <Typography align="center">Нет данных</Typography>
                      ) : (
                        filteredQuestions.map((item, index) => (
                          <Paper key={index} sx={{ p: 1, mb: 1, background: "rgba(255,255,255,0.05)" }}>
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
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default ChatHistory;
