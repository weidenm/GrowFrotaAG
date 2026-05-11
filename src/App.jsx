/**
 * App.jsx
 * Configuração de rotas da aplicação com react-router-dom v6.
 */
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AppProvider } from './context/AppContext';

// Screens
import VehicleListScreen from './screens/VehicleListScreen';
import VehicleDetailScreen from './screens/VehicleDetailScreen';
import MaintenancesScreen from './screens/MaintenancesScreen';
import AlertsScreen from './screens/AlertsScreen';
import StockScreen from './screens/StockScreen';

/** Tema MUI escuro personalizado */
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6C8EFF' },
    background: {
      default: '#0f1117',
      paper: '#151929',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#64748b',
    },
    divider: 'rgba(255,255,255,0.06)',
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#0f1117' },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'rgba(255,255,255,0.04)',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
            '&:hover fieldset': { borderColor: 'rgba(108,142,255,0.4)' },
            '&.Mui-focused fieldset': { borderColor: '#6C8EFF' },
          },
          '& .MuiInputLabel-root': { color: '#64748b' },
          '& .MuiInputBase-input': { color: '#f1f5f9' },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: '#151929',
          '&:hover': { backgroundColor: 'rgba(108,142,255,0.1)' },
          '&.Mui-selected': { backgroundColor: 'rgba(108,142,255,0.2)' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
  shape: { borderRadius: 8 },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<VehicleListScreen />} />
            <Route path="/veiculo/:id" element={<VehicleDetailScreen />} />
            <Route path="/manutencoes" element={<MaintenancesScreen />} />
            <Route path="/alertas" element={<AlertsScreen />} />
            <Route path="/estoque" element={<StockScreen />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}
