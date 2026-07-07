import { Box, Typography, Grid, Paper, Stack, alpha } from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';
import { getAuth } from '../services/auth.service';
import { AppLayout } from '../components/layout/AppLayout';

interface Module {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  adminOnly: boolean;
}

const modules: Module[] = [
  {
    title: 'Productos',
    description: 'Catálogo, precios y características de tus productos.',
    icon: <Inventory2OutlinedIcon />,
    path: '/products',
    adminOnly: true,
  },
  {
    title: 'Inventario',
    description: 'Stock disponible y movimientos por empresa.',
    icon: <WarehouseOutlinedIcon />,
    path: '/inventory',
    adminOnly: true,
  },
  {
    title: 'Empresas',
    description: 'Empresas asociadas a tu operación.',
    icon: <StorefrontOutlinedIcon />,
    path: '/companies',
    adminOnly: false,
  },
  {
    title: 'Usuarios',
    description: 'Cuentas y permisos del equipo.',
    icon: <GroupOutlinedIcon />,
    path: '/users',
    adminOnly: true,
  },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const userRole = auth?.role;
  const username = auth?.username || 'Usuario';

  const visibleModules = modules.filter((m) => !m.adminOnly || userRole === 'admin');

  return (
    <AppLayout
      title={`Hola, ${username}`}
      subtitle="Bienvenido de nuevo. Esto es lo que puedes gestionar hoy."
    >
      <Grid container spacing={2.5}>
        {visibleModules.map((module) => (
          <Grid item xs={12} sm={6} md={visibleModules.length > 2 ? 3 : 6} key={module.path}>
            <Paper
              onClick={() => navigate(module.path)}
              sx={{
                p: 3,
                height: '100%',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                transition: 'border-color 0.15s ease, background-color 0.15s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  '& .module-arrow': {
                    color: 'primary.main',
                  },
                },
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                    color: 'primary.main',
                  }}
                >
                  {module.icon}
                </Box>
                <ChevronRightIcon className="module-arrow" sx={{ color: 'text.disabled', transition: 'color 0.15s ease' }} />
              </Stack>
              <Box>
                <Typography variant="h6" fontSize="1.05rem" mb={0.5}>
                  {module.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {module.description}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </AppLayout>
  );
};

export default DashboardPage;
