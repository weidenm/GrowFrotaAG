/**
 * components/AddVehicleDialog.jsx
 * Dialog/formulário para adicionar um novo veículo à frota.
 */
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useApp } from '../context/AppContext';

const EMPTY_FORM = {
  placa: '',
  modelo: '',
  ano: '',
  kmAtual: '',
  status: 'ok',
};

export default function AddVehicleDialog({ open, onClose }) {
  const { addVehicle } = useApp();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.placa.trim()) e.placa = 'Placa é obrigatória';
    if (!form.modelo.trim()) e.modelo = 'Modelo é obrigatório';
    if (!form.ano || isNaN(form.ano) || form.ano < 1990 || form.ano > 2100)
      e.ano = 'Ano inválido';
    if (!form.kmAtual || isNaN(form.kmAtual) || Number(form.kmAtual) < 0)
      e.kmAtual = 'Km inválido';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    addVehicle({
      placa: form.placa.toUpperCase(),
      modelo: form.modelo,
      ano: Number(form.ano),
      kmAtual: Number(form.kmAtual),
      status: form.status,
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setForm(EMPTY_FORM);
      onClose();
    }, 1200);
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'text.primary',
          fontWeight: 700,
          pb: 1,
        }}
      >
        Adicionar Veículo
        <IconButton onClick={handleClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            Veículo adicionado com sucesso!
          </Alert>
        )}

        <Box component="form" noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Placa"
                name="placa"
                value={form.placa}
                onChange={handleChange}
                error={!!errors.placa}
                helperText={errors.placa}
                placeholder="ABC-1234"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ano"
                name="ano"
                type="number"
                value={form.ano}
                onChange={handleChange}
                error={!!errors.ano}
                helperText={errors.ano}
                inputProps={{ min: 1990, max: 2100 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Modelo"
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
                error={!!errors.modelo}
                helperText={errors.modelo}
                placeholder="Ex: Ford Cargo 1723"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Km Atual"
                name="kmAtual"
                type="number"
                value={form.kmAtual}
                onChange={handleChange}
                error={!!errors.kmAtual}
                helperText={errors.kmAtual}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <MenuItem value="ok">OK</MenuItem>
                <MenuItem value="alerta">Alerta</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={handleClose} sx={{ color: 'text.secondary' }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            bgcolor: '#6C8EFF',
            '&:hover': { bgcolor: '#5a7aff' },
            borderRadius: 2,
            px: 3,
          }}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
