import { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, MenuItem, Alert, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../services/users.service';
import { AppLayout } from '../components/layout/AppLayout';

const roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'external', label: 'Externo' },
];

const CreateUserPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('external');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await createUser({ username, email, role, password });
            navigate('/users');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear el usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout backTo="/users" backLabel="Volver a usuarios" maxWidth="sm">
            <Paper sx={{ p: { xs: 3, sm: 4 } }}>
                <Typography variant="h5" component="h1" mb={0.5}>
                    Crear usuario
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Crea una cuenta y asigna su rol.
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2.5}>
                        <TextField
                            label="Usuario"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Correo"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Contraseña"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            fullWidth
                            required
                        />
                        <TextField
                            select
                            label="Rol"
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            fullWidth
                            required
                        >
                            {roles.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
                            <Button variant="outlined" onClick={() => navigate('/users')}>
                                Cancelar
                            </Button>
                            <Button type="submit" variant="contained" disabled={loading}>
                                {loading ? 'Creando...' : 'Crear usuario'}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Paper>
        </AppLayout>
    );
};

export default CreateUserPage;
