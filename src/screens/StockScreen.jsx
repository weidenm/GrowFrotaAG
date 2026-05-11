/**
 * screens/StockScreen.jsx
 * Tela de estoque de peças e compras sugeridas.
 * - Verde: acima do mínimo
 * - Amarelo: próximo (<=mínimo * 1.5)
 * - Vermelho: abaixo do mínimo
 */
import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useApp } from '../context/AppContext';
import { mockStock } from '../mocks/stock';
import { mockParts } from '../mocks/parts';
import { calcDesgaste } from '../utils/wearCalculator';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';

/** Retorna a cor e label de status de estoque */
function stockStatus(item) {
  if (item.quantidadeAtual < item.estoqueMinimo)
    return { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', label: 'Baixo' };
  if (item.quantidadeAtual <= item.estoqueMinimo * 1.5)
    return { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'Atenção' };
  return { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', label: 'OK' };
}

/** Card de item de estoque */
function StockCard({ item }) {
  const st = stockStatus(item);
  return (
    <Paper
      sx={{
        p: 2.5,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: `${st.color}44`,
        borderRadius: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
          <Typography
            variant="body2"
            sx={{ color: 'text.primary', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {item.nome}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Mínimo: {item.estoqueMinimo} un
          </Typography>
        </Box>
        <Chip
          label={st.label}
          size="small"
          sx={{
            bgcolor: st.bg,
            color: st.color,
            fontWeight: 700,
            fontSize: 11,
            height: 22,
            borderRadius: 1,
          }}
        />
      </Box>
      {/* Quantidade em destaque */}
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: st.color, lineHeight: 1 }}>
          {item.quantidadeAtual}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          / {item.estoqueMinimo} mín
        </Typography>
      </Box>
    </Paper>
  );
}

export default function StockScreen() {
  const { vehicles } = useApp();

  /** Peças com desgaste alto (>= 80%) */
  const highWearPartNames = useMemo(() => {
    const names = new Set();
    mockParts.forEach((part) => {
      const vehicle = vehicles.find((v) => v.id === part.vehicleId);
      if (!vehicle) return;
      const pct = calcDesgaste(vehicle.kmAtual, part.kmUltimaTroca, part.vidaUtilKm);
      if (pct >= 0.8) names.add(part.nome);
    });
    return names;
  }, [vehicles]);

  /** Peças sugeridas = abaixo do mínimo OU desgaste alto */
  const suggested = useMemo(() => {
    return mockStock
      .filter((item) => {
        const belowMin = item.quantidadeAtual < item.estoqueMinimo;
        const highWear = highWearPartNames.has(item.nome);
        return belowMin || highWear;
      })
      .map((item) => {
        const belowMin = item.quantidadeAtual < item.estoqueMinimo;
        const highWear = highWearPartNames.has(item.nome);
        const reasons = [];
        if (belowMin) reasons.push('estoque baixo');
        if (highWear) reasons.push('desgaste alto');
        return { ...item, reasons };
      });
  }, [highWearPartNames]);

  const totalAbaixo = mockStock.filter((i) => i.quantidadeAtual < i.estoqueMinimo).length;

  return (
    <Layout>
      <PageHeader
        title="Estoque de Peças"
        subtitle={`${mockStock.length} itens · ${totalAbaixo} abaixo do mínimo · ${suggested.length} sugeridas para compra`}
      />

      <Box sx={{ px: { xs: 2, sm: 3 }, pb: 4 }}>
        {/* Grid de estoque */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <InventoryIcon sx={{ color: '#6C8EFF', fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, fontSize: 11 }}>
            Inventário
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 5 }}>
          {mockStock.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <StockCard item={item} />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ mb: 4 }} />

        {/* Compras sugeridas */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <ShoppingCartIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, fontSize: 11 }}>
            Compras Sugeridas ({suggested.length})
          </Typography>
        </Box>

        {suggested.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              textAlign: 'center',
            }}
          >
            <Typography sx={{ color: 'text.secondary' }}>
              Nenhuma compra sugerida no momento. Estoque e desgaste dentro dos limites! 🎉
            </Typography>
          </Paper>
        ) : (
          <Paper
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid rgba(255,171,0,0.2)',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <List disablePadding>
              {suggested.map((item, idx) => {
                const belowMin = item.quantidadeAtual < item.estoqueMinimo;
                const highWear = highWearPartNames.has(item.nome);
                const dotColor = belowMin ? '#ef4444' : '#f59e0b';
                return (
                  <React.Fragment key={item.id}>
                    {idx > 0 && <Divider sx={{ borderColor: 'divider' }} />}
                    <ListItem sx={{ py: 1.5, px: 2.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <FiberManualRecordIcon sx={{ fontSize: 10, color: dotColor }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                              {item.nome}
                            </Typography>
                            {item.reasons.map((r) => (
                              <Chip
                                key={r}
                                label={r}
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: 10,
                                  bgcolor: r === 'estoque baixo' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                                  color: r === 'estoque baixo' ? '#f87171' : '#fbbf24',
                                  fontWeight: 600,
                                }}
                              />
                            ))}
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Estoque atual: {item.quantidadeAtual} · Mínimo: {item.estoqueMinimo}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                );
              })}
            </List>
          </Paper>
        )}
      </Box>
    </Layout>
  );
}
