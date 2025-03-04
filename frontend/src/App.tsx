import React, { useState, useEffect } from "react";
import { ThemeProvider, useTheme, styled } from '@mui/material/styles';
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
  IconButton
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import MenuIcon from '@mui/icons-material/Menu';
import Dashboard from "./pages/Review/Dashboard";
import ChatHistory from "./pages/ChatHistory/ChatHistory";
import PerformanceMetrics from "./pages/PerformanceMetrics/PerformanceMetrics";
import CustomMetric from "./pages/CustomMetric/CustomMetric";
import theme from "./theme";

const BackgroundWrapper = styled(Box)({
  position: 'fixed',
  zIndex: -1,
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  background: 'radial-gradient(ellipse at bottom, #1A237E 0%, #000000 80%)',
  overflow: 'hidden'
});

const App: React.FC = () => {
  const [elevated, setElevated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  useEffect(() => {
    const handleScroll = () => {
      setElevated(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
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
      <BackgroundWrapper
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <Router>
        <AppBar
          position="fixed"
          elevation={elevated ? 4 : 0}
          sx={{
            backgroundColor: elevated ? 'rgba(0, 0, 0, 0.6)' : 'transparent',
            backdropFilter: elevated ? 'blur(6px)' : 'none'
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
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                fontFamily: 'Poppins, sans-serif',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}
            >
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
              </>
            )}
          </Toolbar>
        </AppBar>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box
            sx={{ mt: 8, p: 2, width: "100%", maxWidth: "none" }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
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
            </List>
          </Box>
        </Drawer>
        <Box sx={{ mt: 8, p: 2, width: "100%", maxWidth: "none" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chat-history" element={<ChatHistory />} />
              <Route path="/performance" element={<PerformanceMetrics />} />
              <Route path="/custom-metric" element={<CustomMetric />} />
            </Routes>
          </motion.div>
        </Box>

      </Router>
    </ThemeProvider>
  );
};

export default App;
