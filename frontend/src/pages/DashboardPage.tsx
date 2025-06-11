import { Box, Typography, Grid, Paper, Avatar, Stack, Button } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { getAuth, logout } from '../services/auth.service';

const DashboardPage = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const userRole = auth?.role;
  const username = auth?.username || 'Usuario';
  const role = userRole === 'admin' ? 'Administrador' : userRole === 'external' ? 'Externo' : 'Desconocido';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cardStyles = {
    p: 4,
    borderRadius: 4,
    minHeight: 220,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    background: 'rgba(26, 26, 26, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 255, 157, 0.1)',
    boxShadow: '0 0 20px rgba(0, 255, 157, 0.1)',
    transition: 'all 0.3s ease-in-out',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(45deg, rgba(0, 255, 157, 0.1), rgba(0, 255, 255, 0.1))',
      opacity: 0,
      transition: 'opacity 0.3s ease-in-out',
      zIndex: 0,
    },
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 0 30px rgba(0, 255, 157, 0.2)',
      border: '1px solid rgba(0, 255, 157, 0.2)',
      '&::before': {
        opacity: 1,
      },
      '& .MuiAvatar-root': {
        transform: 'scale(1.1)',
        boxShadow: '0 0 20px rgba(0, 255, 157, 0.4)',
      },
    },
  };

  const avatarStyles = {
    width: 56,
    height: 56,
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0 0 15px rgba(0, 255, 157, 0.2)',
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'background.default',
      px: { xs: 2, md: 4, lg: 8, xl: 12 },
      py: 6,
      width: '100%',
      maxWidth: '100vw',
      background: 'radial-gradient(circle at top right, rgba(0, 255, 157, 0.1), transparent 50%), radial-gradient(circle at bottom left, rgba(0, 255, 255, 0.1), transparent 50%)',
      position: 'relative',
    }}>
      {/* Logout Button */}
      <Button
        variant="outlined"
        color="error"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        sx={{
          position: 'absolute',
          top: 24,
          right: { xs: 24, md: 48, lg: 72, xl: 96 },
          fontWeight: 600,
          borderRadius: 2,
          borderWidth: 2,
          px: 3,
          py: 1,
          '&:hover': {
            borderWidth: 2,
            boxShadow: '0 0 20px rgba(255, 0, 0, 0.4)',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
          },
        }}
      >
        Cerrar Sesión
      </Button>

      {/* User Info Section */}
      <Stack direction="row" spacing={2} mb={6} alignItems="center">
        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: 'primary.main',
            fontSize: 24,
            boxShadow: '0 0 15px rgba(0, 255, 157, 0.3)',
          }}
        >
          {username.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight={500} color="primary.main" sx={{ textShadow: '0 0 10px rgba(0, 255, 157, 0.3)' }}>
            {username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Rol: {role}
          </Typography>
        </Box>
      </Stack>

      <Typography
        variant="h3"
        fontWeight={700}
        mb={4}
        color="primary.main"
        letterSpacing={2}
        sx={{
          textShadow: '0 0 20px rgba(0, 255, 157, 0.5)',
          background: 'linear-gradient(45deg, #00ff9d, #00ffff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
        }}
      >
        Bienvenido a Zeiko Dashboard
      </Typography>

      <Grid
        container
        spacing={4}
        sx={{
          maxWidth: { xs: '100%', md: '90%', lg: '85%', xl: '80%' },
          mx: 'auto',
        }}
      >
        {userRole === 'admin' && (
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ ...cardStyles }}>
              <Avatar sx={{ ...avatarStyles, bgcolor: 'primary.main' }}>
                <AccountBalanceWalletIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" fontWeight={600} letterSpacing={1} sx={{ color: 'primary.main', textShadow: '0 0 10px rgba(0, 255, 157, 0.3)' }}>
                Productos
              </Typography>
              <Typography variant="body1" color="grey.300">
                Gestiona y visualiza todos los productos registrados.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    boxShadow: '0 0 20px rgba(0, 255, 157, 0.4)',
                  },
                }}
                onClick={() => navigate('/products')}
              >
                Ver productos
              </Button>
            </Paper>
          </Grid>
        )}
        {userRole === 'admin' && (
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ ...cardStyles }}>
              <Avatar sx={{ ...avatarStyles, bgcolor: 'secondary.main' }}>
                <Inventory2Icon fontSize="large" />
              </Avatar>
              <Typography variant="h5" fontWeight={600} letterSpacing={1} sx={{ color: 'secondary.main', textShadow: '0 0 10px rgba(255, 0, 255, 0.3)' }}>
                Inventario
              </Typography>
              <Typography variant="body1" color="grey.300">
                Consulta el stock y movimientos de inventario.
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    boxShadow: '0 0 20px rgba(255, 0, 255, 0.4)',
                  },
                }}
                onClick={() => navigate('/inventory')}
              >
                Ver inventario
              </Button>
            </Paper>
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={userRole === 'admin' ? 3 : 6}>
          <Paper sx={{ ...cardStyles }}>
            <Avatar sx={{ ...avatarStyles, bgcolor: 'info.main' }}>
              <BusinessIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" fontWeight={600} letterSpacing={1} sx={{ color: 'info.main', textShadow: '0 0 10px rgba(0, 255, 255, 0.3)' }}>
              Empresas
            </Typography>
            <Typography variant="body1" color="grey.300">
              {userRole === 'admin'
                ? 'Administra la información de tus empresas asociadas.'
                : 'Mira las empresas asociadas.'}
            </Typography>
            <Button
              variant="outlined"
              color="info"
              sx={{
                mt: 2,
                borderRadius: 2,
                fontWeight: 600,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)',
                },
              }}
              onClick={() => navigate('/companies')}
            >
              Ver empresas
            </Button>
          </Paper>
        </Grid>
        {userRole === 'admin' && (
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ ...cardStyles }}>
              <Avatar sx={{ ...avatarStyles, bgcolor: 'success.main' }}>
                <PeopleIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" fontWeight={600} letterSpacing={1} sx={{ color: 'success.main', textShadow: '0 0 10px rgba(0, 255, 0, 0.3)' }}>
                Usuarios
              </Typography>
              <Typography variant="body1" color="grey.300">
                Administra los usuarios del sistema.
              </Typography>
              <Button
                variant="outlined"
                color="success"
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    boxShadow: '0 0 20px rgba(0, 255, 0, 0.4)',
                  },
                }}
                onClick={() => navigate('/users')}
              >
                Ver usuarios
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DashboardPage;
