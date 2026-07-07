import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Alert, TextField, Stack } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { updateCompany, getCompanies, type CreateCompanyData } from '../services/companies.service';
import { AppLayout } from '../components/layout/AppLayout';

const EditCompanyPage = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<CreateCompanyData>({
    nit: '',
    name: '',
    address: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companies = await getCompanies();
        const company = companies.find(c => c.id === Number(id));
        if (company) {
          setFormData({
            nit: company.nit,
            name: company.name,
            address: company.address,
            phone: company.phone,
          });
        } else {
          setError('Empresa no encontrada');
        }
      } catch (err) {
        setError('Error al cargar los datos de la empresa');
      }
    };
    fetchData();
  }, [id]);

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
      await updateCompany(Number(id), formData);
      navigate('/companies');
    } catch (err: any) {
      setError(
        err.message ||
        'Error al actualizar la empresa'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout backTo="/companies" backLabel="Volver a empresas" maxWidth="sm">
      <Paper sx={{ p: { xs: 3, sm: 4 } }}>
        <Typography variant="h5" component="h1" mb={0.5}>
          Editar empresa
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Actualiza la información de la empresa.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              name="nit"
              label="NIT"
              value={formData.nit}
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
              name="address"
              label="Dirección"
              value={formData.address}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              name="phone"
              label="Teléfono"
              value={formData.phone}
              onChange={handleChange}
              required
              fullWidth
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
              <Button variant="outlined" onClick={() => navigate('/companies')}>
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

export default EditCompanyPage;
