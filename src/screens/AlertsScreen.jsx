/**
 * screens/AlertsScreen.jsx
 * Tela de alertas de desgaste de peças por veículo.
 * Exibe peças "Em alerta" (>80%) e "Vencidas" (>=100%).
 */
import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  Chip,
  Tabs,
  Tab,
  MenuItem,
  TextField,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useApp } from '../context/AppContext';
import { mockParts } from '../mocks/parts';
import { calcDesgaste, wearSeverity, formatKm } from '../utils/wearCalculator';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';

/** Card de uma peça com barra de desgaste */
function PartWearCard({ part, vehiclePlaca, vehicleKmAtual }) {
  const pct = calcDesgaste(vehicleKmAtual, part.kmUltimaTroca, part.vidaUtilKm);
  const pctClamped = Math.min(pct, 1); // para a barra, máx 100%
  const { label, severity } = wearSeverity(pct);

  const barColor =
    severity === 'error' ? '#ef4444' : severity === 'warning' ? '#f59e0b' : '#22c55e';

  return (
    <Paper
      sx={{
        p: 2.5,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor:
          severity === 'error'
            ? 'rgba(239,68,68,0.25)'
            : severity === 'warning'
            ? 'rgba(245,158,11,0.25)'
            : 'divider',
        borderRadius: 3,
      }}
    >
      {/* Topo: nome + placa + chip */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
        <Box>
          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
            {part.nome}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {vehiclePlaca}
          </Typography>
        </Box>
        <Chip
          label={label}
          size="small"
          icon={
            severity === 'error' ? (
              <ErrorOutlineIcon sx={{ fontSize: '14px !important', color: '#ef4444 !important' }} />
            ) : (
              <WarningAmberIcon sx={{ fontSize: '14px !important', color: '#f59e0b !important' }} />
            )
          }
          sx={{
            bgcolor:
              severity === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
            color: severity === 'error' ? '#f87171' : '#fbbf24',
            fontWeight: 600,
            fontSize: 11,
            height: 24,
          }}
        />
      </Box>

      {/* Barra de desgaste */}
      <Box sx={{ mb: 1 }}>
        <LinearProgress
          variant="determinate"
          value={pctClamped * 100}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: 'divider',
            '& .MuiLinearProgress-bar': {
              bgcolor: barColor,
              borderRadius: 4,
            },
          }}
        />
      </Box>

      {/* Info linha */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Desgaste: <span style={{ color: barColor, fontWeight: 700 }}>{Math.round(pct * 100)}%</span>
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Vida útil: {formatKm(part.vidaUtilKm)}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Km rodado desde troca: {formatKm(vehicleKmAtual - part.kmUltimaTroca)}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function AlertsScreen() {
  const { vehicles } = useApp();
  const [tab, setTab] = useState(0); // 0 = alerta, 1 = vencidas, 2 = ok
  const [filterVehicle, setFilterVehicle] = useState('all');

  // Combina peças com km atual do veículo e calcula desgaste
  const allParts = useMemo(() => {
    return mockParts.map((part) => {
      const vehicle = vehicles.find((v) => v.id === part.vehicleId);
      if (!vehicle) return null;
      const pct = calcDesgaste(vehicle.kmAtual, part.kmUltimaTroca, part.vidaUtilKm);
      return { ...part, vehicle, pct };
    }).filter(Boolean);
  }, [vehicles]);

  const filtered = allParts
    .filter((p) => filterVehicle === 'all' || p.vehicleId === filterVehicle)
    .filter((p) => {
      if (tab === 0) return p.pct >= 0.8 && p.pct < 1;
      if (tab === 1) return p.pct >= 1;
      return p.pct < 0.8;
    })
    .sort((a, b) => b.pct - a.pct);

  const countAlerta = allParts.filter((p) => p.pct >= 0.8 && p.pct < 1).length;
  const countVencidas = allParts.filter((p) => p.pct >= 1).length;
  const countOk = allParts.filter((p) => p.pct < 0.8).length;

  return (
    <Layout>
      <PageHeader
        title="Alertas de Desgaste"
        subtitle={`${countVencidas} peça${countVencidas !== 1 ? 's' : ''} vencida${countVencidas !== 1 ? 's' : ''} · ${countAlerta} em alerta`}
      />

      <Box sx={{ px: { xs: 2, sm: 3 }, pb: 4 }}>
        {/* Filtro por veículo */}
        <TextField
          select
          size="small"
          value={filterVehicle}
          onChange={(e) => setFilterVehicle(e.target.value)}
          sx={{
            mb: 3,
            minWidth: 200,
            '& .MuiOutlinedInput-root': { borderRadius: 2 },
          }}
          label="Filtrar por veículo"
        >
          <MenuItem value="all">Todos os veículos</MenuItem>
          {vehicles.map((v) => (
            <MenuItem key={v.id} value={v.id}>
              {v.placa}
            </MenuItem>
          ))}
        </TextField>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            mb: 3,
            '& .MuiTab-root': { color: 'text.secondary', fontSize: 13, textTransform: 'none', fontWeight: 600 },
            '& .Mui-selected': { color: '#6C8EFF' },
            '& .MuiTabs-indicator': { bgcolor: '#6C8EFF' },
          }}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <WarningAmberIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                Em alerta ({countAlerta})
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <ErrorOutlineIcon sx={{ fontSize: 16, color: '#ef4444' }} />
                Vencidas ({countVencidas})
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 16, color: '#22c55e' }} />
                OK ({countOk})
              </Box>
            }
          />
        </Tabs>

        {/* Listagem */}
        {filtered.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 3,
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 40, color: '#22c55e', mb: 1 }} />
            <Typography sx={{ color: 'text.secondary' }}>
              Nenhuma peça nesta categoria para o filtro selecionado.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filtered.map((part) => (
              <Grid item xs={12} sm={6} md={4} key={part.id}>
                <PartWearCard
                  part={part}
                  vehiclePlaca={part.vehicle.placa}
                  vehicleKmAtual={part.vehicle.kmAtual}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Layout>
  );
}
