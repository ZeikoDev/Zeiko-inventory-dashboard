import { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createCompany, type CreateCompanyData } from '../services/companies.service';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
      setError(err?.response?.data?.detail || 'Error al crear la empresa');
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
          Crear Nueva Empresa
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="NIT"
            name="nit"
            variant="outlined"
            value={formData.nit}
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
            label="Dirección"
            name="address"
            variant="outlined"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            required
            sx={{ input: { color: 'white' } }}
          />
          <TextField
            label="Teléfono"
            name="phone"
            variant="outlined"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            required
            sx={{ input: { color: 'white' } }}
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
              {loading ? 'Creando...' : 'Crear Empresa'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateCompanyPage; 