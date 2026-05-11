// Mock de veículos da frota
// Cada veículo possui: id, placa, modelo, ano, kmAtual e status
export const mockVehicles = [
  {
    id: 'v1',
    placa: 'ABC-1234',
    modelo: 'Ford Cargo 1723',
    ano: 2019,
    kmAtual: 187500,
    status: 'alerta', // 'ok' | 'alerta'
  },
  {
    id: 'v2',
    placa: 'DEF-5678',
    modelo: 'Mercedes-Benz Atego 1726',
    ano: 2021,
    kmAtual: 95300,
    status: 'ok',
  },
  {
    id: 'v3',
    placa: 'GHI-9012',
    modelo: 'Volkswagen Constellation 19.360',
    ano: 2018,
    kmAtual: 312000,
    status: 'alerta',
  },
  {
    id: 'v4',
    placa: 'JKL-3456',
    modelo: 'Iveco Daily 70C17',
    ano: 2022,
    kmAtual: 42000,
    status: 'ok',
  },
  {
    id: 'v5',
    placa: 'MNO-7890',
    modelo: 'Scania R 450',
    ano: 2020,
    kmAtual: 224800,
    status: 'alerta',
  },
];
