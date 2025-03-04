import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";
import Dashboard from "./pages/Review/Dashboard";
import ChatHistory from "./pages/ChatHistory/ChatHistory";
import PerformanceMetrics from "./pages/PerformanceMetrics/PerformanceMetrics";
import CustomMetric from "./pages/CustomMetric/CustomMetric";
import HallucinationMetric from "./pages/HallucinationMetric/HallucinationMetric";
import AdditionalAnalytics from "./pages/AdditionalAnalytics/AdditionalAnalytics";
import theme from "./theme";

const App: React.FC = () => {
  const [elevated, setElevated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const handleScroll = () => {
      setElevated(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar
          position="fixed"
          elevation={elevated ? 4 : 0}
          sx={{
            backgroundColor: elevated ? "rgba(0, 0, 0, 0.6)" : "transparent",
            backdropFilter: elevated ? "blur(6px)" : "none",
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={toggleDrawer(true)}
                edge="start"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Дашборд качества модели
            </Typography>
            {!isMobile && (
              <>
                <Button color="inherit" component={Link} to="/">
                  Обзор
                </Button>
                <Button color="inherit" component={Link} to="/chat-history">
                  Чаты
                </Button>
                <Button color="inherit" component={Link} to="/performance">
                  Производительность
                </Button>
                <Button color="inherit" component={Link} to="/custom-metric">
                  Доп. метрика
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/hallucination-metric"
                >
                  Галлюцинации
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/additional-analytics"
                >
                  Аналитика
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box
            sx={{ mt: 8, p: 2, width: "100%" }}
            role="presentation"
            onClick={toggleDrawer(false)}
          >
            <List>
              <ListItem button component={Link} to="/">
                <ListItemText primary="Обзор" />
              </ListItem>
              <ListItem button component={Link} to="/chat-history">
                <ListItemText primary="Чаты" />
              </ListItem>
              <ListItem button component={Link} to="/performance">
                <ListItemText primary="Производительность" />
              </ListItem>
              <ListItem button component={Link} to="/custom-metric">
                <ListItemText primary="Доп. метрика" />
              </ListItem>
              <ListItem button component={Link} to="/hallucination-metric">
                <ListItemText primary="Галлюцинации" />
              </ListItem>
              <ListItem button component={Link} to="/additional-analytics">
                <ListItemText primary="Аналитика" />
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Box
          sx={{
            mt: 8,
            pr: 7,
            pl: 7,
            width: "100vw",
            height: "99vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{ flex: 1, width: "100%" }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chat-history" element={<ChatHistory />} />
              <Route path="/performance" element={<PerformanceMetrics />} />
              <Route path="/custom-metric" element={<CustomMetric />} />
              <Route
                path="/hallucination-metric"
                element={<HallucinationMetric />}
              />
              <Route
                path="/additional-analytics"
                element={<AdditionalAnalytics />}
              />
            </Routes>
          </motion.div>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
