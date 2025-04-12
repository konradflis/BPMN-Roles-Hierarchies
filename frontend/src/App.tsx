import React, { useState, useEffect } from 'react';
import BpmnViewerComponent from './components/BPMNViewer';
import { uploadBpmn } from './api';
import { CssBaseline, AppBar, Toolbar, Grid, Typography, Box, CircularProgress,
    ThemeProvider, createTheme } from "@mui/material";
import HomePage from "./pages/HomePage";
import backgroundImage from "./assets/panoramic-view-sunset-night.jpg";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0059a5",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#000000",
      paper: "#000000",
    },
    text: {
      primary: "#ffffff",
    },
  },
});

const App: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

useEffect(() => {
const handleScroll = () => {
if (activeTab === 0) {
  setIsScrolled(window.scrollY > 50);
} else {
  setIsScrolled(true);
}
};
window.addEventListener("scroll", handleScroll);


return () => window.removeEventListener("scroll", handleScroll);
}, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          transition: 'all 0.75s ease-in-out',
          height: activeTab === 0 ? (isScrolled ? '64px' : '100vh') : '64px',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: isScrolled || activeTab !== 0 ? 3 : 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 999,
        }}
      >
        {(!isScrolled && activeTab === 0) && (
          <Box
            sx={{
              width: '100%',
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              textAlign: "center",
              py: 4,
            }}
          >
            <Typography variant="h2" sx={{ color: "white", fontWeight: 600 }}>
              BPMN - Roles & Hierarchies
            </Typography>
            <Typography variant="body1" sx={{ color: "white", fontSize: "1rem", marginTop: 1 }}>
              Add roles and hierarchies to BPMN models within a moment!
            </Typography>
          </Box>
        )}
      </AppBar>


      <Box
        sx={{
          marginTop: "20vh",
          marginBottom: "20vh",
          height: "auto",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 0,
        }}
      >
        <Box sx={{ width: "100%"}}>
            <Grid container spacing={2}> </Grid>
            <HomePage />
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: "#121212",
          color: "white",
          textAlign: "center",
          padding: "12px",
          position: "fixed",
          bottom: 0,
          width: "100%",
        }}
      >
        <Typography variant="body2">
          2025 BPMN | Konrad Flis & Klaudiusz Grobelski
        </Typography>

      </Box>
    </ThemeProvider>
  );
};

export default App;