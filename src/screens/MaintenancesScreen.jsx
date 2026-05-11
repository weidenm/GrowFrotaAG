/**
 * screens/MaintenancesScreen.jsx
 * Tela de registro de manutenção (escolhe veículo e preenche o formulário).
 */
import React from 'react';
import { Box } from '@mui/material';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import MaintenanceForm from '../components/MaintenanceForm';

export default function MaintenancesScreen() {
  return (
    <Layout>
      <PageHeader
        title="Registrar Manutenção"
        subtitle="Selecione o veículo e informe os dados da manutenção realizada"
      />
      <Box sx={{ px: { xs: 2, sm: 3 }, pb: 4, maxWidth: 800 }}>
        <MaintenanceForm />
      </Box>
    </Layout>
  );
}
