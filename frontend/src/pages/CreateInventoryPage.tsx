import { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createInventory, type CreateInventoryData } from '../services/inventory.service';
import { getProducts } from '../services/products.service';
import { getCompanies } from '../services/companies.service';
import type { Product } from '../services/products.service';
import type { Company } from '../services/companies.service';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CreateInventoryPage = () => {
  const [formData, setFormData] = useState<CreateInventoryData>({
    product: 0,
    company: 0,
    quantity: 0,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, companiesData] = await Promise.all([
          getProducts(),
          getCompanies()
        ]);
        setProducts(productsData);
        setCompanies(companiesData);
      } catch (err) {
        setError('Error al cargar los datos necesarios');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : Number(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createInventory(formData);
      navigate('/inventory');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Error al crear el registro de inventario');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = formData.company
    ? products.filter((product) => product.company === formData.company)
    : products;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
        py: 6,
        position: 'relative',
      }}
    >
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
      <Paper
        elevation={8}
        sx={{
          p: { xs: 3, sm: 6 },
          borderRadius: 4,
          maxWidth: 600,
          width: '100%',
          bgcolor: 'background.paper',
          boxShadow: '0 8px 32px 0 rgba(0,225,255,0.15)',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          color="primary.main"
          fontWeight={700}
          letterSpacing={1}
          mb={4}
        >
          Agregar al Inventario
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            select
            label="Empresa"
            name="company"
            variant="outlined"
            value={formData.company}
            onChange={handleChange}
            fullWidth
            required
            sx={{ input: { color: 'white' } }}
          >
            {companies.map((company) => (
              <MenuItem key={company.id} value={company.id}>
                {company.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Producto"
            name="product"
            variant="outlined"
            value={formData.product}
            onChange={handleChange}
            fullWidth
            required
            sx={{ input: { color: 'white' } }}
            disabled={!formData.company}
          >
            {filteredProducts.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Cantidad"
            name="quantity"
            type="number"
            variant="outlined"
            value={formData.quantity}
            onChange={handleChange}
            fullWidth
            required
            inputProps={{ min: 0 }}
            sx={{ input: { color: 'white' } }}
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/inventory')}
              sx={{
                flex: 1,
                fontWeight: 600,
                borderRadius: 2,
                py: 1.2,
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                flex: 1,
                fontWeight: 700,
                borderRadius: 2,
                py: 1.2,
                fontSize: '1.1rem',
                letterSpacing: 1,
                boxShadow: '0 0 16px 0 #00e1ff55',
              }}
              disabled={loading}
            >
              {loading ? 'Agregando...' : 'Agregar al Inventario'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateInventoryPage; 