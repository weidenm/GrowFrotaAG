/**
 * components/VehicleCard.jsx
 * Card de veículo exibido na listagem da frota.
 */
import React from 'react';
import {
  Card,
  CardActionArea,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { formatKm } from '../utils/wearCalculator';

export default function VehicleCard({ vehicle, onClick }) {
  const isAlerta = vehicle.status === 'alerta';

  return (
    <Card
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: isAlerta ? 'rgba(255,171,0,0.3)' : 'divider',
        borderRadius: 3,
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: isAlerta ? 'rgba(255,171,0,0.6)' : 'rgba(108,142,255,0.4)',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        },
      }}
    >
      <CardActionArea onClick={onClick} sx={{ p: 2.5 }}>
        {/* Linha de topo: ícone + placa + status */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: 'rgba(108,142,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <DirectionsBusIcon sx={{ color: '#6C8EFF', fontSize: 22 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: 1 }}
            >
              {vehicle.placa}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {vehicle.modelo}
            </Typography>
          </Box>
          <Chip
            label={isAlerta ? 'Alerta' : 'OK'}
            size="small"
            sx={{
              bgcolor: isAlerta ? 'rgba(255,171,0,0.15)' : 'rgba(34,197,94,0.15)',
              color: isAlerta ? '#fbbf24' : '#4ade80',
              fontWeight: 600,
              fontSize: 11,
              height: 24,
              borderRadius: 1,
            }}
          />
        </Box>

        {/* Linha inferior: ano + km */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Ano
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
              {vehicle.ano}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Km atual
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
              {formatKm(vehicle.kmAtual)}
            </Typography>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}
