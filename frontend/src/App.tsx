import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CompaniesPage from './pages/CompaniesPage';
import CreateCompanyPage from './pages/CreateCompanyPage';
import InventoryPage from './pages/InventoryPage';
import CreateInventoryPage from './pages/CreateInventoryPage';
import ProductsPage from './pages/ProductsPage';
import CreateProductPage from './pages/CreateProductPage';
import EditCompanyPage from './pages/EditCompanyPage';
import EditInventoryPage from './pages/EditInventoryPage';
import EditProductPage from './pages/EditProductPage';
import UsersPage from './pages/UsersPage';
import { getAuth } from './services/auth.service';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff9d',
      light: '#33ffb1',
      dark: '#00cc7d',
      contrastText: '#000',
    },
    secondary: {
      main: '#ff00ff',
      light: '#ff33ff',
      dark: '#cc00cc',
      contrastText: '#fff',
    },
    info: {
      main: '#00ffff',
      light: '#33ffff',
      dark: '#00cccc',
      contrastText: '#000',
    },
    success: {
      main: '#00ff00',
      light: '#33ff33',
      dark: '#00cc00',
      contrastText: '#000',
    },
    warning: {
      main: '#ffff00',
      light: '#ffff33',
      dark: '#cccc00',
      contrastText: '#000',
    },
    error: {
      main: '#ff0000',
      light: '#ff3333',
      dark: '#cc0000',
      contrastText: '#fff',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h3: {
      fontWeight: 800,
      letterSpacing: 2,
      textShadow: '0 0 10px rgba(0, 255, 157, 0.5)',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: 1.5,
      textShadow: '0 0 8px rgba(0, 255, 157, 0.4)',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: 1,
      textShadow: '0 0 6px rgba(0, 255, 157, 0.3)',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: 0.5,
      textShadow: '0 0 4px rgba(0, 255, 157, 0.2)',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 0 20px rgba(0, 255, 157, 0.1)',
          '&:hover': {
            boxShadow: '0 0 30px rgba(0, 255, 157, 0.2)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 0 15px rgba(0, 255, 157, 0.2)',
          '&:hover': {
            boxShadow: '0 0 25px rgba(0, 255, 157, 0.4)',
          },
        },
        contained: {
          '&.MuiButton-containedPrimary': {
            background: 'linear-gradient(45deg, #00ff9d 30%, #00ffff 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #00cc7d 30%, #00cccc 90%)',
            },
          },
          '&.MuiButton-containedSecondary': {
            background: 'linear-gradient(45deg, #ff00ff 30%, #ff33ff 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #cc00cc 30%, #cc33cc 90%)',
            },
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(26, 26, 26, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 255, 157, 0.1)',
          '&:hover': {
            border: '1px solid rgba(0, 255, 157, 0.2)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(0, 255, 157, 0.1)',
        },
        head: {
          fontWeight: 700,
          color: '#00ff9d',
          textShadow: '0 0 5px rgba(0, 255, 157, 0.3)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: 'rgba(26, 26, 26, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 255, 157, 0.2)',
          boxShadow: '0 0 30px rgba(0, 255, 157, 0.2)',
        },
      },
    },
  },
});

function RequireAdmin({ children }: { children: JSX.Element }) {
  const auth = getAuth();
  const location = useLocation();
  if (!auth || auth.role !== 'admin') {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/create" element={
            <RequireAdmin>
              <CreateCompanyPage />
            </RequireAdmin>
          } />
          <Route path="/companies/edit/:id" element={
            <RequireAdmin>
              <EditCompanyPage />
            </RequireAdmin>
          } />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/inventory/create" element={
            <RequireAdmin>
              <CreateInventoryPage />
            </RequireAdmin>
          } />
          <Route path="/inventory/edit/:id" element={
            <RequireAdmin>
              <EditInventoryPage />
            </RequireAdmin>
          } />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/create" element={
            <RequireAdmin>
              <CreateProductPage />
            </RequireAdmin>
          } />
          <Route path="/products/edit/:id" element={
            <RequireAdmin>
              <EditProductPage />
            </RequireAdmin>
          } />
          <Route path="/users" element={
            <RequireAdmin>
              <UsersPage />
            </RequireAdmin>
          } />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;