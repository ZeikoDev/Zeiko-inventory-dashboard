import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useColorMode } from '../../context/ColorModeContext';
import { getAuth, logout } from '../../services/auth.service';

interface AppLayoutProps {
  title?: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
  actions?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
}

export const AppLayout = ({
  title,
  subtitle,
  backTo,
  backLabel = 'Volver',
  actions,
  maxWidth = 'lg',
  children,
}: AppLayoutProps) => {
  const navigate = useNavigate();
  const { mode, toggleColorMode } = useColorMode();
  const auth = getAuth();
  const username = auth?.username || 'Usuario';
  const roleLabel = auth?.role === 'admin' ? 'Administrador' : 'Externo';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="inherit" sx={{ bgcolor: 'background.paper' }}>
        <Toolbar sx={{ gap: 1 }}>
          <Stack
            direction="row"
            spacing={1.25}
            alignItems="center"
            onClick={() => navigate('/dashboard')}
            sx={{ cursor: 'pointer', mr: 'auto' }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                color: 'primary.main',
              }}
            >
              <Inventory2OutlinedIcon fontSize="small" />
            </Box>
            <Typography variant="h6" fontSize="1.05rem" color="text.primary">
              Zeiko Inventory
            </Typography>
          </Stack>

          <Tooltip title={mode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
            <IconButton onClick={toggleColorMode} size="small" sx={{ color: 'text.secondary' }}>
              {mode === 'dark' ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Stack
            direction="row"
            spacing={1.25}
            alignItems="center"
            sx={{ display: { xs: 'none', sm: 'flex' }, pl: 1 }}
          >
            <Avatar sx={{ width: 32, height: 32, fontSize: '0.9rem', bgcolor: 'primary.main' }}>
              {username.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
                {username}
              </Typography>
              <Typography variant="caption" color="text.secondary" lineHeight={1.2}>
                {roleLabel}
              </Typography>
            </Box>
          </Stack>

          <Tooltip title="Cerrar sesión">
            <IconButton onClick={handleLogout} size="small" sx={{ color: 'text.secondary' }}>
              <LogoutOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth={maxWidth} sx={{ py: { xs: 3, md: 4 } }}>
        {backTo && (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(backTo)}
            size="small"
            sx={{ mb: 2, color: 'text.secondary' }}
          >
            {backLabel}
          </Button>
        )}

        {(title || actions) && (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
            mb={3}
          >
            <Box>
              {title && (
                <Typography variant="h5" component="h1" color="text.primary">
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            {actions && (
              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                {actions}
              </Stack>
            )}
          </Stack>
        )}

        {children}
      </Container>
    </Box>
  );
};

export const RoleChip = ({ role }: { role: string }) => (
  <Chip
    size="small"
    label={role === 'admin' ? 'Administrador' : 'Externo'}
    color={role === 'admin' ? 'primary' : 'default'}
    variant="outlined"
  />
);
