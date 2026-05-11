/**
 * components/Layout.jsx
 * Shell principal com barra de navegação inferior (mobile-first)
 * e lateral em telas maiores.
 */
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import BuildIcon from '@mui/icons-material/Build';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const DRAWER_WIDTH = 220;

const navItems = [
  { label: 'Frota', path: '/', icon: <DirectionsBusIcon /> },
  { label: 'Manutenções', path: '/manutencoes', icon: <BuildIcon /> },
  { label: 'Alertas', path: '/alertas', icon: <WarningAmberIcon /> },
  { label: 'Estoque', path: '/estoque', icon: <InventoryIcon /> },
];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  // Determina o índice ativo para o BottomNavigation
  const activeIndex = navItems.findIndex((item) =>
    item.path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(item.path)
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Drawer lateral (desktop) */}
      {isDesktop && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              bgcolor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {/* Logo */}
          <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LocalShippingIcon sx={{ color: '#6C8EFF', fontSize: 28 }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.5px' }}
            >
              GrowFrota
            </Typography>
          </Box>

          <List sx={{ px: 1 }}>
            {navItems.map((item) => {
              const active = item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);
              return (
                <ListItemButton
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    color: active ? '#6C8EFF' : 'text.secondary',
                    bgcolor: active ? 'rgba(108,142,255,0.12)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(108,142,255,0.08)', color: active ? '#a5b8ff' : 'text.primary' },
                    transition: 'all 0.2s',
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: active ? 600 : 400, fontSize: 14 }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Drawer>
      )}

      {/* Conteúdo principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          pb: isDesktop ? 0 : '70px', // espaço para bottom nav mobile
          overflow: 'hidden',
        }}
      >
        {children}
      </Box>

      {/* Bottom Navigation (mobile) */}
      {!isDesktop && (
        <BottomNavigation
          value={activeIndex}
          onChange={(_, newValue) => navigate(navItems[newValue].path)}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1300,
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            height: 64,
            '& .MuiBottomNavigationAction-root': { color: 'text.secondary' },
            '& .Mui-selected': { color: '#6C8EFF' },
          }}
        >
          {navItems.map((item) => (
            <BottomNavigationAction
              key={item.path}
              label={item.label}
              icon={item.icon}
              sx={{ '& .MuiBottomNavigationAction-label': { fontSize: 10 } }}
            />
          ))}
        </BottomNavigation>
      )}
    </Box>
  );
}
