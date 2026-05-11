/**
 * screens/VehicleDetailScreen.jsx
 * Detalhe de um veículo: informações, histórico de manutenções e formulário
 * para registrar nova manutenção.
 */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  Grid,
  Paper,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import BuildIcon from '@mui/icons-material/Build';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';
import MaintenanceForm from '../components/MaintenanceForm';
import { formatKm, formatBRL, calcTotalCost } from '../utils/wearCalculator';

/** Linha expansível do histórico de manutenção */
function MaintenanceRow({ m }) {
  const [open, setOpen] = useState(false);
  const total = calcTotalCost(m.pecas);

  return (
    <>
      <TableRow
        sx={{
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' },
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{m.data}</TableCell>
        <TableCell>
          <Chip
            label={m.tipo === 'preventiva' ? 'Preventiva' : 'Corretiva'}
            size="small"
            sx={{
              bgcolor: m.tipo === 'preventiva' ? 'rgba(108,142,255,0.15)' : 'rgba(239,68,68,0.15)',
              color: m.tipo === 'preventiva' ? '#6C8EFF' : '#f87171',
              fontWeight: 600,
              fontSize: 11,
              height: 22,
            }}
          />
        </TableCell>
        <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{formatKm(m.kmHora)}</TableCell>
        <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{m.pecas.length} peça{m.pecas.length !== 1 ? 's' : ''}</TableCell>
        <TableCell sx={{ color: '#6C8EFF', fontWeight: 700, fontSize: 13 }}>{formatBRL(total)}</TableCell>
        <TableCell>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ p: 0, border: 0 }}>
          <Collapse in={open}>
            <Box sx={{ px: 3, py: 2, bgcolor: 'action.hover' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                Peças trocadas
              </Typography>
              <Table size="small" sx={{ mt: 1 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'text.secondary', fontSize: 11, borderBottom: '1px solid', borderColor: 'divider' }}>Peça</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: 11, borderBottom: '1px solid', borderColor: 'divider' }}>Qtd</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: 11, borderBottom: '1px solid', borderColor: 'divider' }}>Unit.</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: 11, borderBottom: '1px solid', borderColor: 'divider' }}>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {m.pecas.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ color: 'text.secondary', fontSize: 12, borderBottom: '1px solid', borderColor: 'divider' }}>{p.nome}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: 12, borderBottom: '1px solid', borderColor: 'divider' }}>{p.quantidade}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: 12, borderBottom: '1px solid', borderColor: 'divider' }}>{formatBRL(p.custoUnitario)}</TableCell>
                      <TableCell sx={{ color: '#6C8EFF', fontSize: 12, fontWeight: 600, borderBottom: '1px solid', borderColor: 'divider' }}>{formatBRL(p.quantidade * p.custoUnitario)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function VehicleDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles, maintenances } = useApp();
  const [tab, setTab] = useState(0);

  const vehicle = vehicles.find((v) => v.id === id);
  const vehicleMaintenances = maintenances
    .filter((m) => m.vehicleId === id)
    .sort((a, b) => new Date(b.data) - new Date(a.data));

  if (!vehicle) {
    return (
      <Layout>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography sx={{ color: 'text.secondary' }}>Veículo não encontrado.</Typography>
          <Button onClick={() => navigate('/')} sx={{ mt: 2, color: '#6C8EFF' }}>
            Voltar à frota
          </Button>
        </Box>
      </Layout>
    );
  }

  const isAlerta = vehicle.status === 'alerta';
  const totalGasto = vehicleMaintenances.reduce(
    (acc, m) => acc + calcTotalCost(m.pecas),
    0
  );

  return (
    <Layout>
      {/* Cabeçalho com botão voltar */}
      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 3, pb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ color: 'text.secondary', mb: 2, textTransform: 'none' }}
        >
          Voltar à frota
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.5px' }}>
                {vehicle.placa}
              </Typography>
              <Chip
                label={isAlerta ? 'Alerta' : 'OK'}
                size="small"
                sx={{
                  bgcolor: isAlerta ? 'rgba(255,171,0,0.15)' : 'rgba(34,197,94,0.15)',
                  color: isAlerta ? '#fbbf24' : '#4ade80',
                  fontWeight: 600,
                  fontSize: 11,
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {vehicle.modelo} · {vehicle.ano}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Cards de resumo */}
      <Box sx={{ px: { xs: 2, sm: 3 }, mb: 3 }}>
        <Grid container spacing={2}>
          {[
            { label: 'Km Atual', value: formatKm(vehicle.kmAtual) },
            { label: 'Manutenções', value: vehicleMaintenances.length },
            { label: 'Total Gasto', value: formatBRL(totalGasto) },
          ].map((stat) => (
            <Grid item xs={6} sm={4} key={stat.label}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  {stat.label}
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700, mt: 0.5 }}>
                  {stat.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Tabs: Histórico / Nova Manutenção */}
      <Box sx={{ px: { xs: 2, sm: 3 } }}>
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
          <Tab label={`Histórico (${vehicleMaintenances.length})`} id="tab-historico" />
          <Tab label="Nova Manutenção" icon={<BuildIcon sx={{ fontSize: 16 }} />} iconPosition="start" id="tab-nova" />
        </Tabs>

        {/* Aba Histórico */}
        {tab === 0 && (
          <Box>
            {vehicleMaintenances.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 6,
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 3,
                }}
              >
                <BuildIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
                <Typography sx={{ color: 'text.secondary' }}>
                  Nenhuma manutenção registrada para este veículo.
                </Typography>
                <Button
                  sx={{ mt: 2, color: '#6C8EFF' }}
                  onClick={() => setTab(1)}
                >
                  Registrar primeira manutenção
                </Button>
              </Box>
            ) : (
              <Paper
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'action.hover' }}>
                        {['Data', 'Tipo', 'Km/Hora', 'Peças', 'Total', ''].map((h) => (
                          <TableCell
                            key={h}
                            sx={{
                              color: 'text.secondary',
                              fontSize: 11,
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: 1,
                              borderBottom: '1px solid',
                              borderColor: 'divider',
                            }}
                          >
                            {h}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {vehicleMaintenances.map((m) => (
                        <MaintenanceRow key={m.id} m={m} />
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Paper>
            )}
          </Box>
        )}

        {/* Aba Nova Manutenção */}
        {tab === 1 && (
          <Box sx={{ maxWidth: 800, pb: 4 }}>
            <MaintenanceForm
              preselectedVehicleId={vehicle.id}
              onSuccess={() => setTab(0)}
            />
          </Box>
        )}
      </Box>
    </Layout>
  );
}
