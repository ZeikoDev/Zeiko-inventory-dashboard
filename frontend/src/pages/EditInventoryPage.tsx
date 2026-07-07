import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Alert, MenuItem, Select, FormControl, InputLabel, TextField, Stack } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { updateInventory, getInventory, type CreateInventoryData } from '../services/inventory.service';
import { getProducts } from '../services/products.service';
import { getCompanies } from '../services/companies.service';
import type { Product } from '../services/products.service';
import type { Company } from '../services/companies.service';
import { AppLayout } from '../components/layout/AppLayout';

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
        err.message ||
        'Error al actualizar el registro de inventario'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout backTo="/inventory" backLabel="Volver al inventario" maxWidth="sm">
      <Paper sx={{ p: { xs: 3, sm: 4 } }}>
        <Typography variant="h5" component="h1" mb={0.5}>
          Editar inventario
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Actualiza el stock registrado.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
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

            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
              <Button variant="outlined" onClick={() => navigate('/inventory')}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </AppLayout>
  );
};

export default EditInventoryPage;
