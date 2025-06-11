import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Alert, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { updateCompany, getCompanies, type Company, type CreateCompanyData } from '../services/companies.service';

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
        err?.response?.data?.detail ||
        (err?.response?.data && JSON.stringify(err.response.data)) ||
        err.message ||
        'Error al actualizar la empresa'
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
          Editar Empresa
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/companies')}
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

export default EditCompanyPage; 