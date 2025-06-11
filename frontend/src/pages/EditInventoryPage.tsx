import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Alert, MenuItem, Select, FormControl, InputLabel, TextField } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { updateInventory, getInventory, type CreateInventoryData } from '../services/inventory.service';
import { getProducts } from '../services/products.service';
import { getCompanies } from '../services/companies.service';
import type { Product } from '../services/products.service';
import type { Company } from '../services/companies.service';

const EditInventoryPage = () => {
  const { id } = useParams<{ id: string }>();
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
        const [productsData, companiesData, inventoryData] = await Promise.all([
          getProducts(),
          getCompanies(),
          getInventory()
        ]);
        setProducts(productsData);
        setCompanies(companiesData);
        const item = inventoryData.find(i => i.id === Number(id));
        if (item) {
          setFormData({
            product: item.product,
            company: item.company,
            quantity: item.quantity,
          });
        } else {
          setError('Registro de inventario no encontrado');
        }
      } catch (err) {
        setError('Error al cargar los datos');
      }
    };
    fetchData();
  }, [id]);

  const filteredProducts = formData.company
    ? products.filter((product) => product.company === formData.company)
    : products;

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await updateInventory(Number(id), formData);
      navigate('/inventory');
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
        (err?.response?.data && JSON.stringify(err.response.data)) ||
        err.message ||
        'Error al actualizar el registro de inventario'
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
          Editar Inventario
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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

          <FormControl fullWidth>
            <InputLabel id="product-label">Producto</InputLabel>
            <Select
              labelId="product-label"
              name="product"
              value={formData.product || ''}
              onChange={handleSelectChange}
              label="Producto"
              required
              disabled={!formData.company}
            >
              {filteredProducts.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            name="quantity"
            label="Cantidad"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            required
            fullWidth
            inputProps={{ min: 0 }}
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
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditInventoryPage; 