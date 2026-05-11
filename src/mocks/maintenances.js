// Mock de histórico de manutenções
// Cada manutenção referencia um veículo (vehicleId)
export const mockMaintenances = [
  {
    id: 'm1',
    vehicleId: 'v1',
    data: '2025-12-10',
    tipo: 'preventiva',
    kmHora: 172000,
    pecas: [
      { nome: 'Filtro de óleo', quantidade: 1, custoUnitario: 45.0 },
      { nome: 'Óleo do motor 15W40 (5L)', quantidade: 2, custoUnitario: 120.0 },
      { nome: 'Filtro de ar', quantidade: 1, custoUnitario: 85.0 },
    ],
  },
  {
    id: 'm2',
    vehicleId: 'v1',
    data: '2025-09-03',
    tipo: 'corretiva',
    kmHora: 155000,
    pecas: [
      { nome: 'Pastilha de freio dianteira', quantidade: 4, custoUnitario: 75.0 },
      { nome: 'Disco de freio', quantidade: 2, custoUnitario: 280.0 },
    ],
  },
  {
    id: 'm3',
    vehicleId: 'v2',
    data: '2026-01-15',
    tipo: 'preventiva',
    kmHora: 88000,
    pecas: [
      { nome: 'Filtro de combustível', quantidade: 1, custoUnitario: 55.0 },
      { nome: 'Filtro de óleo', quantidade: 1, custoUnitario: 45.0 },
    ],
  },
  {
    id: 'm4',
    vehicleId: 'v3',
    data: '2025-10-22',
    tipo: 'corretiva',
    kmHora: 298000,
    pecas: [
      { nome: 'Correia dentada', quantidade: 1, custoUnitario: 340.0 },
      { nome: 'Tensor da correia', quantidade: 1, custoUnitario: 180.0 },
      { nome: 'Bomba d\'água', quantidade: 1, custoUnitario: 420.0 },
    ],
  },
  {
    id: 'm5',
    vehicleId: 'v5',
    data: '2026-02-08',
    tipo: 'preventiva',
    kmHora: 210000,
    pecas: [
      { nome: 'Filtro de ar', quantidade: 1, custoUnitario: 110.0 },
      { nome: 'Filtro de óleo', quantidade: 1, custoUnitario: 45.0 },
      { nome: 'Velas de ignição', quantidade: 6, custoUnitario: 28.0 },
    ],
  },
];
