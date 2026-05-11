/**
 * context/AppContext.jsx
 * Contexto global para veículos e manutenções (estado em memória).
 */
import React, { createContext, useContext, useState } from 'react';
import { mockVehicles } from '../mocks/vehicles';
import { mockMaintenances } from '../mocks/maintenances';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [maintenances, setMaintenances] = useState(mockMaintenances);

  /** Adiciona um veículo à lista */
  const addVehicle = (vehicle) => {
    const newV = {
      ...vehicle,
      id: `v${Date.now()}`,
      status: 'ok',
    };
    setVehicles((prev) => [newV, ...prev]);
  };

  /** Registra uma manutenção para um veículo e atualiza o kmAtual */
  const addMaintenance = (maintenance) => {
    const newM = { ...maintenance, id: `m${Date.now()}` };
    setMaintenances((prev) => [newM, ...prev]);
    // Atualiza o km do veículo se o km da manutenção for maior
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === maintenance.vehicleId && maintenance.kmHora > v.kmAtual
          ? { ...v, kmAtual: maintenance.kmHora }
          : v
      )
    );
  };

  return (
    <AppContext.Provider value={{ vehicles, maintenances, addVehicle, addMaintenance }}>
      {children}
    </AppContext.Provider>
  );
}

/** Hook para consumir o contexto */
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
