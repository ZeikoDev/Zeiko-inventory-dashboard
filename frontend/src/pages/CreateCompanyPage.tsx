import { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createCompany, type CreateCompanyData } from '../services/companies.service';
import { AppLayout } from '../components/layout/AppLayout';

const CreateCompanyPage = () => {
  const [formData, setFormData] = useState<CreateCompanyData>({
    nit: '',
    name: '',
    address: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createCompany(formData);
      navigate('/companies');
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Error al crear la empresa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout backTo="/companies" backLabel="Volver a empresas" maxWidth="sm">
      <Paper sx={{ p: { xs: 3, sm: 4 } }}>
        <Typography variant="h5" component="h1" mb={0.5}>
          Crear empresa
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Registra una nueva empresa asociada.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              label="NIT"
              name="nit"
              value={formData.nit}
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
              label="Dirección"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Teléfono"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              required
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
              <Button variant="outlined" onClick={() => navigate('/companies')}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Creando...' : 'Crear empresa'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </AppLayout>
  );
};

export default CreateCompanyPage;
