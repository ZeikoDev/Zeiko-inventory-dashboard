import { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, MenuItem, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createInventory, type CreateInventoryData } from '../services/inventory.service';
import { getProducts } from '../services/products.service';
import { getCompanies } from '../services/companies.service';
import type { Product } from '../services/products.service';
import type { Company } from '../services/companies.service';
import { AppLayout } from '../components/layout/AppLayout';

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
      setError(err instanceof Error ? err.message : 'Error al crear el registro de inventario');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = formData.company
    ? products.filter((product) => product.company === formData.company)
    : products;

  return (
    <AppLayout backTo="/inventory" backLabel="Volver al inventario" maxWidth="sm">
      <Paper sx={{ p: { xs: 3, sm: 4 } }}>
        <Typography variant="h5" component="h1" mb={0.5}>
          Agregar al inventario
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Registra el stock de un producto para una empresa.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              select
              label="Empresa"
              name="company"
              value={formData.company}
              onChange={handleChange}
              fullWidth
              required
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
              value={formData.product}
              onChange={handleChange}
              fullWidth
              required
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
              value={formData.quantity}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ min: 0 }}
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
              <Button variant="outlined" onClick={() => navigate('/inventory')}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Agregando...' : 'Agregar al inventario'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </AppLayout>
  );
};

export default CreateInventoryPage;
