/**
 * App.jsx
 * Configuração de rotas da aplicação com react-router-dom v6.
 */
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { CustomThemeProvider } from './context/ThemeContext';

// Screens
import VehicleListScreen from './screens/VehicleListScreen';
import VehicleDetailScreen from './screens/VehicleDetailScreen';
import MaintenancesScreen from './screens/MaintenancesScreen';
import AlertsScreen from './screens/AlertsScreen';
import StockScreen from './screens/StockScreen';

export default function App() {
  return (
    <CustomThemeProvider>
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
    </CustomThemeProvider>
  );
}
