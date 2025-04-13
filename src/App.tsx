import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import WatchMovie from './pages/WatchMovie';
import Admin from './pages/Admin';
import SearchResults from './pages/SearchResults';
import { Backdrop } from '@mui/material';
import { CircularProgress } from '@mui/material';
import axios, { AxiosRequestConfig } from 'axios';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF6B6B',
    },
    secondary: {
      main: '#4ECDC4',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
        },
      },
    },
  },
});

const App: React.FC = () => {

  const [loading, setLoading] = useState(false);

  // Axios interceptor'ü ayarlama
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
        (config) => {
            setLoading(true); // İstek başladığında loading'i true yap
            return config;
        },
        (error) => {
            setLoading(false); // Hata durumunda loading'i false yap
            return Promise.reject(error);
        }
    );

    const responseInterceptor = axios.interceptors.response.use(
        (response) => {
            setLoading(false); // İstek tamamlandığında loading'i false yap
            return response;
        },
        (error) => {
            setLoading(false); // Hata durumunda loading'i false yap
            return Promise.reject(error);
        }
    );

    // Cleanup function to remove interceptors
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
}, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Backdrop open={loading} style={{ zIndex: 9999 }}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:id" element={<WatchMovie />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 