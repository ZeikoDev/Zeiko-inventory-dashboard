import { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createProduct, type CreateProductData } from '../services/products.service';
import { getCompanies } from '../services/companies.service';
import type { Company } from '../services/companies.service';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
      setError(err?.response?.data?.detail || 'Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

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
          Crear Nuevo Producto
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Código"
            name="code"
            variant="outlined"
            value={formData.code}
            onChange={handleChange}
            fullWidth
            required
            sx={{ input: { color: 'white' } }}
          />

          <TextField
            label="Nombre"
            name="name"
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            sx={{ input: { color: 'white' } }}
          />

          <TextField
            label="Características"
            name="characteristics"
            variant="outlined"
            value={formData.characteristics}
            onChange={handleChange}
            fullWidth
            required
            multiline
            rows={3}
            sx={{ input: { color: 'white' } }}
          />

          <TextField
            label="Precio USD"
            name="price_usd"
            type="number"
            variant="outlined"
            value={formData.price_usd}
            onChange={handleChange}
            fullWidth
            required
            inputProps={{ min: 0, step: 0.01 }}
            sx={{ input: { color: 'white' } }}
          />

          <TextField
            label="Precio EUR"
            name="price_eur"
            type="number"
            variant="outlined"
            value={formData.price_eur}
            onChange={handleChange}
            fullWidth
            required
            inputProps={{ min: 0, step: 0.01 }}
            sx={{ input: { color: 'white' } }}
          />

          <TextField
            label="Precio COP"
            name="price_cop"
            type="number"
            variant="outlined"
            value={formData.price_cop}
            onChange={handleChange}
            fullWidth
            required
            inputProps={{ min: 0, step: 0.01 }}
            sx={{ input: { color: 'white' } }}
          />

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

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/products')}
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
              {loading ? 'Creando...' : 'Crear Producto'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateProductPage; 