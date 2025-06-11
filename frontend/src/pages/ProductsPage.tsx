import { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from '@mui/material';
import { getProducts } from '../services/products.service';
import type { Product } from '../services/products.service';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import axios from 'axios';
import { getCompanies, type Company } from '../services/companies.service';
import { getAuth } from '../services/auth.service';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { deleteProduct } from '../services/products.service';
import { Table } from '../components/organisms/Table';
import { Card } from '../components/atoms/Card';

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
      const response = await axios.get('http://localhost:8000/api/products/recommendation/', {
        headers: {
          Authorization: auth ? `Bearer ${auth.access}` : '',
        },
        params: { description: companyDescription }
      });
      setRecommendation(response.data.recommendation);
    } catch (err: any) {
      setRecommendationError(
        err?.response?.data?.error ||
        (err?.response?.data && JSON.stringify(err.response.data)) ||
        err.message ||
        'No se pudo obtener la recomendación.'
      );
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
        <Box>
          <Button
            size="small"
            color="primary"
            onClick={() => navigate(`/products/edit/${row.id}`)}
            sx={{ minWidth: 0, mr: 1 }}
          >
            <EditIcon />
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => handleDeleteClick(row)}
            sx={{ minWidth: 0 }}
          >
            <DeleteIcon />
          </Button>
        </Box>
      )
    }] : [])
  ];

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', px: 2, py: 6, position: 'relative' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/dashboard')}
        sx={{
          position: 'absolute',
          top: 24,
          left: 24,
          fontWeight: 600,
          borderRadius: 2,
          bgcolor: 'background.paper',
          color: 'primary.main',
          boxShadow: '0 2px 8px 0 #00e1ff22',
          zIndex: 10,
        }}
      >
        Volver al Dashboard
      </Button>
      <Box sx={{ width: '100%', maxWidth: 1200, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" color="primary.main" fontWeight={600} letterSpacing={1}>
            Productos registrados
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<InfoOutlinedIcon />}
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              py: 1,
              borderWidth: 2,
              borderColor: 'secondary.main',
              ml: 2,
            }}
            onClick={handleRecommendationClick}
          >
            Recomendación de producto tendencia con IA
          </Button>
        </Box>
        {userRole === 'admin' && (
          <Button variant="contained" color="primary" sx={{ mb: 3, fontWeight: 700, borderRadius: 2, py: 1.2, fontSize: '1.1rem', letterSpacing: 1 }} onClick={() => navigate('/products/create')}>
            Crear nuevo producto
          </Button>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        )}
        <Card>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <Table
              columns={columns}
              data={products}
            />
          )}
        </Card>
      </Box>
      {userRole === 'admin' && (
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{ sx: { bgcolor: 'background.paper', borderRadius: 2 } }}
        >
          <DialogTitle sx={{ color: 'primary.main', fontWeight: 600 }}>
            Confirmar Eliminación
          </DialogTitle>
          <DialogContent>
            <Typography>
              ¿Está seguro que desea eliminar el producto "{productToDelete?.name}"?
              Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setDeleteDialogOpen(false)} sx={{ fontWeight: 600 }}>
              Cancelar
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={loading} sx={{ fontWeight: 600 }}>
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
            Obtener Recomendación
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={recommendationOpen} onClose={() => setRecommendationOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Recomendación de Productos</DialogTitle>
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
              <CircularProgress color="primary" />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRecommendationOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsPage; 