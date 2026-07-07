import { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getCompanies, deleteCompany, type Company } from '../services/companies.service';
import { getAuth } from '../services/auth.service';
import { Table } from '../components/organisms/Table';
import { AppLayout } from '../components/layout/AppLayout';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const userRole = auth?.role;

  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (err) {
      setError('Error al cargar las empresas');
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDeleteClick = (company: Company) => {
    setCompanyToDelete(company);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!companyToDelete) return;

    setLoading(true);
    try {
      await deleteCompany(companyToDelete.id);
      await fetchCompanies();
      setDeleteDialogOpen(false);
      setCompanyToDelete(null);
    } catch (err) {
      setError('Error al eliminar la empresa');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { id: 'nit', label: 'NIT' },
    { id: 'name', label: 'Nombre' },
    { id: 'address', label: 'Dirección' },
    { id: 'phone', label: 'Teléfono' },
    ...(userRole === 'admin' ? [{
      id: 'actions',
      label: 'Acciones',
      render: (_: unknown, row: Company) => (
        <Box sx={{ whiteSpace: 'nowrap' }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => navigate(`/companies/edit/${row.id}`)}
            sx={{ mr: 0.5 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDeleteClick(row)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    }] : [])
  ];

  return (
    <AppLayout
      title="Empresas"
      subtitle="Empresas asociadas a tu operación"
      backTo="/dashboard"
      backLabel="Volver al dashboard"
      maxWidth="md"
      actions={
        userRole === 'admin' ? (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/companies/create')}>
            Nueva empresa
          </Button>
        ) : undefined
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Table
        columns={columns}
        data={companies}
      />

      {userRole === 'admin' && (
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>
            Confirmar eliminación
          </DialogTitle>
          <DialogContent>
            <Typography>
              ¿Está seguro que desea eliminar la empresa "{companyToDelete?.name}"?
              Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AppLayout>
  );
};

export default CompaniesPage;
