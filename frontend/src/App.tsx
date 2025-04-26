import React, { useState, useEffect } from 'react';
import BpmnViewerComponent from './components/BPMNViewer';
import { uploadBpmn } from './api';
import { CssBaseline, AppBar, Toolbar, Grid, Typography, Box, CircularProgress,
    ThemeProvider, createTheme, Tab, Tabs } from "@mui/material";
import HomePage from "./pages/HomePage";
import EventLogs from "./pages/EventLogs"
import BPMNVisualisation from "./pages/BPMNVisualisation";
import AddingRoles from "./pages/AddingRoles";
import backgroundImage from "./assets/panoramic-view-sunset-night.jpg";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#202122",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#f1f1f1",
      paper: "#f1f1f1",
    },
    text: {
      primary: "#000000",
    },
  },
});

const App: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [errors, setErrors] = useState({});

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

const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setErrors({});
  };

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
  <Toolbar sx={{ width: '100%', display: "flex", justifyContent: "center", alignItems: "center" }}>
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
    {(isScrolled || activeTab !== 0) && (
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="Algorithm Tabs"
          sx={{
            color: "white",
            display: "flex",
            justifyContent: "center",
            width: "auto",
            '& .MuiTab-root': {
              color: "gray",
            },
            '& .Mui-selected': {
              color: "#ffffff",
            },
          }}
        >
          <Tab label="Home" />
          <Tab label="Visualise event logs" />
          <Tab label="Visualise any BPMN model" />
          <Tab label="Add roles" />
        </Tabs>
      )}
    </Toolbar>
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
        {activeTab === 0 && <HomePage />}
        {activeTab === 1 && <EventLogs />}
        {activeTab === 2 && <BPMNVisualisation />}
        {activeTab === 3 && <AddingRoles />}
    </Box>
  </Box>

  <Box
    sx={{
      backgroundColor: "#000000",
      color: "white",
      textAlign: "center",
      padding: "12px",
      position: "fixed",
      bottom: 0,
      width: "100%",
      zIndex: 1300,
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