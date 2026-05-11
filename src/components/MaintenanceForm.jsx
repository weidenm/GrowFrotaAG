/**
 * components/MaintenanceForm.jsx
 * Formulário completo para registrar uma manutenção em um veículo.
 * Suporta lista dinâmica de peças trocadas.
 */
import React, { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Grid,
  IconButton,
  Divider,
  Alert,
  Paper,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useApp } from '../context/AppContext';
import { formatBRL } from '../utils/wearCalculator';

const EMPTY_PECA = { nome: '', quantidade: '', custoUnitario: '' };

const EMPTY_FORM = {
  vehicleId: '',
  data: '',
  tipo: 'preventiva',
  kmHora: '',
  pecas: [{ ...EMPTY_PECA }],
};

export default function MaintenanceForm({ preselectedVehicleId, onSuccess }) {
  const { vehicles, addMaintenance } = useApp();
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    vehicleId: preselectedVehicleId || '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePecaChange = (index, e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const pecas = [...prev.pecas];
      pecas[index] = { ...pecas[index], [name]: value };
      return { ...prev, pecas };
    });
  };

  const addPeca = () => {
    setForm((prev) => ({ ...prev, pecas: [...prev.pecas, { ...EMPTY_PECA }] }));
  };

  const removePeca = (index) => {
    setForm((prev) => ({
      ...prev,
      pecas: prev.pecas.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.vehicleId) e.vehicleId = 'Selecione um veículo';
    if (!form.data) e.data = 'Data é obrigatória';
    if (!form.kmHora || isNaN(form.kmHora) || Number(form.kmHora) < 0)
      e.kmHora = 'Km/hora inválido';
    form.pecas.forEach((p, i) => {
      if (!p.nome.trim()) e[`peca_nome_${i}`] = 'Nome obrigatório';
      if (!p.quantidade || isNaN(p.quantidade) || Number(p.quantidade) <= 0)
        e[`peca_qtd_${i}`] = 'Qtd inválida';
      if (!p.custoUnitario || isNaN(p.custoUnitario) || Number(p.custoUnitario) < 0)
        e[`peca_custo_${i}`] = 'Custo inválido';
    });
    return e;
  };

  // Calcula total das peças
  const total = form.pecas.reduce(
    (acc, p) => acc + Number(p.quantidade || 0) * Number(p.custoUnitario || 0),
    0
  );

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    addMaintenance({
      vehicleId: form.vehicleId,
      data: form.data,
      tipo: form.tipo,
      kmHora: Number(form.kmHora),
      pecas: form.pecas.map((p) => ({
        nome: p.nome,
        quantidade: Number(p.quantidade),
        custoUnitario: Number(p.custoUnitario),
      })),
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setForm({ ...EMPTY_FORM, vehicleId: preselectedVehicleId || '' });
      onSuccess?.();
    }, 1500);
  };

  return (
    <Box>
      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          ✅ Manutenção registrada com sucesso!
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* Veículo */}
        {!preselectedVehicleId && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Veículo"
              name="vehicleId"
              value={form.vehicleId}
              onChange={handleChange}
              error={!!errors.vehicleId}
              helperText={errors.vehicleId}
            >
              {vehicles.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.placa} — {v.modelo}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}

        {/* Data */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Data"
            name="data"
            type="date"
            value={form.data}
            onChange={handleChange}
            error={!!errors.data}
            helperText={errors.data}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Tipo */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Tipo"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
          >
            <MenuItem value="preventiva">Preventiva</MenuItem>
            <MenuItem value="corretiva">Corretiva</MenuItem>
          </TextField>
        </Grid>

        {/* Km/Hora */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Km / Hora na data"
            name="kmHora"
            type="number"
            value={form.kmHora}
            onChange={handleChange}
            error={!!errors.kmHora}
            helperText={errors.kmHora}
            inputProps={{ min: 0 }}
          />
        </Grid>
      </Grid>

      {/* Peças */}
      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, fontSize: 11 }}>
            Peças Trocadas
          </Typography>
          <Button
            size="small"
            startIcon={<AddCircleOutlineIcon />}
            onClick={addPeca}
            sx={{ color: '#6C8EFF', fontSize: 12 }}
          >
            Adicionar peça
          </Button>
        </Box>

        {form.pecas.map((peca, index) => (
          <Paper
            key={index}
            sx={{
              p: 2,
              mb: 1.5,
              bgcolor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 2,
            }}
          >
            <Grid container spacing={1.5} alignItems="flex-start">
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  size="small"
                  label="Nome da peça"
                  name="nome"
                  value={peca.nome}
                  onChange={(e) => handlePecaChange(index, e)}
                  error={!!errors[`peca_nome_${index}`]}
                  helperText={errors[`peca_nome_${index}`]}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Quantidade"
                  name="quantidade"
                  type="number"
                  value={peca.quantidade}
                  onChange={(e) => handlePecaChange(index, e)}
                  error={!!errors[`peca_qtd_${index}`]}
                  helperText={errors[`peca_qtd_${index}`]}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Custo unit. (R$)"
                  name="custoUnitario"
                  type="number"
                  value={peca.custoUnitario}
                  onChange={(e) => handlePecaChange(index, e)}
                  error={!!errors[`peca_custo_${index}`]}
                  helperText={errors[`peca_custo_${index}`]}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} sm={1} sx={{ display: 'flex', justifyContent: { xs: 'flex-end', sm: 'center' }, alignItems: 'center' }}>
                {form.pecas.length > 1 && (
                  <IconButton
                    size="small"
                    onClick={() => removePeca(index)}
                    sx={{ color: '#ef4444' }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          </Paper>
        ))}

        {/* Total */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Total estimado:&nbsp;
            <Typography component="span" sx={{ color: '#6C8EFF', fontWeight: 700 }}>
              {formatBRL(total)}
            </Typography>
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.06)' }} />

      <Button
        variant="contained"
        onClick={handleSave}
        fullWidth
        size="large"
        sx={{
          bgcolor: '#6C8EFF',
          '&:hover': { bgcolor: '#5a7aff' },
          borderRadius: 2,
          py: 1.5,
          fontWeight: 700,
          letterSpacing: 0.5,
        }}
      >
        Salvar Manutenção
      </Button>
    </Box>
  );
}
