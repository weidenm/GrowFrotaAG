/**
 * screens/VehicleListScreen.jsx
 * Tela principal: listagem de veículos da frota + botão adicionar.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import VehicleCard from '../components/VehicleCard';
import AddVehicleDialog from '../components/AddVehicleDialog';

export default function VehicleListScreen() {
  const { vehicles } = useApp();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  const totalAlerta = vehicles.filter((v) => v.status === 'alerta').length;

  return (
    <Layout>
      <PageHeader
        title="Frota"
        subtitle={`${vehicles.length} veículo${vehicles.length !== 1 ? 's' : ''} cadastrado${vehicles.length !== 1 ? 's' : ''} · ${totalAlerta} em alerta`}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{
              bgcolor: '#6C8EFF',
              '&:hover': { bgcolor: '#5a7aff' },
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Adicionar veículo
          </Button>
        }
      />

      <Box sx={{ px: { xs: 2, sm: 3 }, pb: 4 }}>
        {vehicles.length === 0 ? (
          // Estado vazio
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 300,
              gap: 2,
            }}
          >
            <DirectionsBusIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5 }} />
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Nenhum veículo cadastrado
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              sx={{ borderColor: '#6C8EFF', color: '#6C8EFF', borderRadius: 2 }}
            >
              Adicionar primeiro veículo
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {vehicles.map((v) => (
              <Grid item xs={12} sm={6} md={4} key={v.id}>
                <VehicleCard
                  vehicle={v}
                  onClick={() => navigate(`/veiculo/${v.id}`)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <AddVehicleDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Layout>
  );
}
