import { ThemeProvider, CssBaseline } from '@mui/material';
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
import CreateUserPage from './pages/CreateUserPage';
import EditUserPage from './pages/EditUserPage';
import { getAuth } from './services/auth.service';
import { theme } from './styles/theme';

function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = getAuth();
  const location = useLocation();
  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function RequireAdmin({ children }: { children: JSX.Element }) {
  const auth = getAuth();
  const location = useLocation();
  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (auth.role !== 'admin') {
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
          <Route path="/dashboard" element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          } />
          <Route path="/companies" element={
            <RequireAuth>
              <CompaniesPage />
            </RequireAuth>
          } />
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
          <Route path="/inventory" element={
            <RequireAuth>
              <InventoryPage />
            </RequireAuth>
          } />
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
          <Route path="/products" element={
            <RequireAuth>
              <ProductsPage />
            </RequireAuth>
          } />
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
          <Route path="/users/create" element={<RequireAdmin><CreateUserPage /></RequireAdmin>} />
          <Route path="/users/edit/:id" element={<RequireAdmin><EditUserPage /></RequireAdmin>} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
