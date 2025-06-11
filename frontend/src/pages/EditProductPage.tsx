import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Alert, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { updateProduct, getProducts, type Product, type CreateProductData } from '../services/products.service';
import { getCompanies, type Company } from '../services/companies.service';

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
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
    const fetchData = async () => {
      try {
        const [products, companiesData] = await Promise.all([
          getProducts(),
          getCompanies()
        ]);
        setCompanies(companiesData);
        const product = products.find(p => p.id === Number(id));
        if (product) {
          setFormData({
            code: product.code,
            name: product.name,
            characteristics: product.characteristics,
            price_usd: product.price_usd,
            price_eur: product.price_eur,
            price_cop: product.price_cop,
            company: product.company,
          });
        } else {
          setError('Producto no encontrado');
        }
      } catch (err) {
        setError('Error al cargar los datos del producto');
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('price') ? Number(value) : value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await updateProduct(Number(id), formData);
      navigate('/products');
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
        (err?.response?.data && JSON.stringify(err.response.data)) ||
        err.message ||
        'Error al actualizar el producto'
      );
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
      }}
    >
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
          Editar Producto
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            name="code"
            label="Código"
            value={formData.code}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            name="name"
            label="Nombre"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            name="characteristics"
            label="Características"
            value={formData.characteristics}
            onChange={handleChange}
            required
            fullWidth
            multiline
            rows={4}
          />

          <TextField
            name="price_usd"
            label="Precio USD"
            type="number"
            value={formData.price_usd}
            onChange={handleChange}
            required
            fullWidth
            inputProps={{ min: 0, step: 0.01 }}
          />

          <TextField
            name="price_eur"
            label="Precio EUR"
            type="number"
            value={formData.price_eur}
            onChange={handleChange}
            required
            fullWidth
            inputProps={{ min: 0, step: 0.01 }}
          />

          <TextField
            name="price_cop"
            label="Precio COP"
            type="number"
            value={formData.price_cop}
            onChange={handleChange}
            required
            fullWidth
            inputProps={{ min: 0, step: 0.01 }}
          />

          <FormControl fullWidth>
            <InputLabel id="company-label">Empresa</InputLabel>
            <Select
              labelId="company-label"
              name="company"
              value={formData.company || ''}
              onChange={handleSelectChange}
              label="Empresa"
              required
            >
              {companies.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditProductPage; 