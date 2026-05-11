import React, { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const ThemeContext = createContext({ toggleTheme: () => {}, mode: 'dark' });

export function CustomThemeProvider({ children }) {
  const [mode, setMode] = useState('dark');

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#6C8EFF' },
      background: {
        default: mode === 'dark' ? '#0f1117' : '#f8fafc',
        paper: mode === 'dark' ? '#151929' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#f1f5f9' : '#0f172a',
        secondary: mode === 'dark' ? '#64748b' : '#475569',
      },
      divider: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { backgroundColor: mode === 'dark' ? '#0f1117' : '#f8fafc' },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#ffffff',
              '& fieldset': { borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)' },
              '&:hover fieldset': { borderColor: 'rgba(108,142,255,0.4)' },
              '&.Mui-focused fieldset': { borderColor: '#6C8EFF' },
            },
            '& .MuiInputLabel-root': { color: mode === 'dark' ? '#64748b' : '#475569' },
            '& .MuiInputBase-input': { color: mode === 'dark' ? '#f1f5f9' : '#0f172a' },
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#151929' : '#ffffff',
            '&:hover': { backgroundColor: mode === 'dark' ? 'rgba(108,142,255,0.1)' : 'rgba(108,142,255,0.08)' },
            '&.Mui-selected': { backgroundColor: mode === 'dark' ? 'rgba(108,142,255,0.2)' : 'rgba(108,142,255,0.16)' },
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
  }), [mode]);

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useCustomTheme = () => useContext(ThemeContext);
