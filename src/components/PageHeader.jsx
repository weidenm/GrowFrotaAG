/**
 * components/PageHeader.jsx
 * Cabeçalho padronizado de página com título e subtítulo opcional e toggle de tema.
 */
import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useCustomTheme } from '../context/ThemeContext';

export default function PageHeader({ title, subtitle, action }) {
  const { mode, toggleTheme } = useCustomTheme();

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3 },
        pt: { xs: 3, sm: 4 },
        pb: 2,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Box>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.5px' }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={toggleTheme} sx={{ color: 'text.secondary' }}>
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        {action && <Box>{action}</Box>}
      </Box>
    </Box>
  );
}
