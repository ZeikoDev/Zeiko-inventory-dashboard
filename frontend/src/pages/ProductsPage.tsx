import { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from '@mui/material';
import { getProducts } from '../services/products.service';
import type { Product } from '../services/products.service';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { api, getApiErrorMessage } from '../services/api';
import { getCompanies, type Company } from '../services/companies.service';
import { getAuth } from '../services/auth.service';
import { deleteProduct } from '../services/products.service';
import { Table } from '../components/organisms/Table';
import { AppLayout } from '../components/layout/AppLayout';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();
  const userRole = auth?.role;
  const [recommendationOpen, setRecommendationOpen] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [recommendationError, setRecommendationError] = useState('');
  const [askCompanyOpen, setAskCompanyOpen] = useState(false);
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyDescriptionError, setCompanyDescriptionError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [productsData, companiesData] = await Promise.all([
        getProducts(),
        getCompanies()
      ]);
      setProducts(productsData);
      setCompanies(companiesData);
    } catch (err) {
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setLoading(true);
    try {
      await deleteProduct(productToDelete.id);
      await fetchProducts();
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (err) {
      setError('Error al eliminar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationClick = () => {
    setCompanyDescription('');
    setCompanyDescriptionError('');
    setRecommendation('');
    setRecommendationError('');
    setAskCompanyOpen(true);
  };

  const handleAskCompanyConfirm = async () => {
    if (!companyDescription.trim()) {
      setCompanyDescriptionError('Por favor describe brevemente de qué es tu empresa.');
      return;
    }
    setAskCompanyOpen(false);
    setRecommendationOpen(true);
    setRecommendation('');
    setRecommendationError('');
    try {
      const response = await api.get('/products/recommendation/', {
        params: { description: companyDescription }
      });
      setRecommendation(response.data.recommendation);
    } catch (err) {
      setRecommendationError(getApiErrorMessage(err, 'No se pudo obtener la recomendación.'));
    }
  };

  const getCompanyName = (companyId: number) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'Empresa no encontrada';
  };

  const columns = [
    { id: 'code', label: 'Código' },
    { id: 'name', label: 'Nombre' },
    { id: 'characteristics', label: 'Características' },
    {
      id: 'price_usd',
      label: 'Precio USD',
      render: (value: number) => `$${value}`
    },
    {
      id: 'price_eur',
      label: 'Precio EUR',
      render: (value: number) => `€${value}`
    },
    {
      id: 'price_cop',
      label: 'Precio COP',
      render: (value: number) => `$${value}`
    },
    {
      id: 'company',
      label: 'Empresa',
      render: (value: number) => getCompanyName(value)
    },
    ...(userRole === 'admin' ? [{
      id: 'actions',
      label: 'Acciones',
      render: (_: unknown, row: Product) => (
        <Box sx={{ whiteSpace: 'nowrap' }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => navigate(`/products/edit/${row.id}`)}
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
      title="Productos"
      subtitle="Catálogo de productos registrados"
      backTo="/dashboard"
      backLabel="Volver al dashboard"
      actions={
        <>
          <Button
            variant="outlined"
            startIcon={<AutoAwesomeOutlinedIcon />}
            onClick={handleRecommendationClick}
          >
            Recomendación con IA
          </Button>
          {userRole === 'admin' && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/products/create')}>
              Nuevo producto
            </Button>
          )}
        </>
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Table
          columns={columns}
          data={products}
        />
      )}

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
              ¿Está seguro que desea eliminar el producto "{productToDelete?.name}"?
              Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={loading}>
              {loading ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Dialog open={askCompanyOpen} onClose={() => setAskCompanyOpen(false)}>
        <DialogTitle>¿De qué es tu empresa?</DialogTitle>
        <DialogContent>
          <TextField
            label="Describe brevemente a qué se dedica tu empresa"
            value={companyDescription}
            onChange={e => {
              setCompanyDescription(e.target.value);
              setCompanyDescriptionError('');
            }}
            fullWidth
            multiline
            minRows={2}
            sx={{ mt: 1 }}
            error={!!companyDescriptionError}
            helperText={companyDescriptionError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAskCompanyOpen(false)}>Cancelar</Button>
          <Button onClick={handleAskCompanyConfirm} variant="contained" color="primary">
            Obtener recomendación
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={recommendationOpen} onClose={() => setRecommendationOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Recomendación de productos</DialogTitle>
        <DialogContent>
          {recommendationError ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {recommendationError}
            </Alert>
          ) : recommendation ? (
            <Typography sx={{ mt: 2, whiteSpace: 'pre-line' }}>
              {recommendation}
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRecommendationOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
};

export default ProductsPage;
