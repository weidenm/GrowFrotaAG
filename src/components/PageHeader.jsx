/**
 * components/PageHeader.jsx
 * Cabeçalho padronizado de página com título e subtítulo opcional.
 */
import React from 'react';
import { Box, Typography } from '@mui/material';

export default function PageHeader({ title, subtitle, action }) {
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
          sx={{ fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px' }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  );
}
