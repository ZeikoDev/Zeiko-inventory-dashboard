import { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, MenuItem, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createProduct, type CreateProductData } from '../services/products.service';
import { getCompanies } from '../services/companies.service';
import type { Company } from '../services/companies.service';
import { AppLayout } from '../components/layout/AppLayout';

const CreateProductPage = () => {
  const [formData, setFormData] = useState<CreateProductData>({
    code: '',
    name: '',
    characteristics: '',
    price_usd: 0,
    price_eur: 0,
    price_cop: 0,
    company: 0,
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data);
      } catch (err) {
        setError('Error al cargar las empresas');
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.startsWith('price_') ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createProduct(formData);
      navigate('/products');
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout backTo="/products" backLabel="Volver a productos" maxWidth="sm">
      <Paper sx={{ p: { xs: 3, sm: 4 } }}>
        <Typography variant="h5" component="h1" mb={0.5}>
          Crear producto
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Registra un nuevo producto en el catálogo.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              label="Código"
              name="code"
              value={formData.code}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Nombre"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Características"
              name="characteristics"
              value={formData.characteristics}
              onChange={handleChange}
              fullWidth
              required
              multiline
              rows={3}
            />

            <TextField
              label="Precio USD"
              name="price_usd"
              type="number"
              value={formData.price_usd}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ min: 0, step: 0.01 }}
            />

            <TextField
              label="Precio EUR"
              name="price_eur"
              type="number"
              value={formData.price_eur}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ min: 0, step: 0.01 }}
            />

            <TextField
              label="Precio COP"
              name="price_cop"
              type="number"
              value={formData.price_cop}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ min: 0, step: 0.01 }}
            />

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

            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
              <Button variant="outlined" onClick={() => navigate('/products')}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Creando...' : 'Crear producto'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </AppLayout>
  );
};

export default CreateProductPage;
