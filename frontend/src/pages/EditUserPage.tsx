import { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button, MenuItem, Alert, Stack, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getUsers, updateUser, type User } from '../services/users.service';
import { AppLayout } from '../components/layout/AppLayout';

const roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'external', label: 'Externo' },
];

const EditUserPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('external');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const users = await getUsers();
                const found = users.find(u => u.id === Number(id));
                if (found) {
                    setUser(found);
                    setUsername(found.username);
                    setEmail(found.email);
                    setRole(found.role);
                } else {
                    setError('Usuario no encontrado');
                }
            } catch {
                setError('Error al cargar el usuario');
            }
        };
        fetchUser();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await updateUser(Number(id), { username, email, role });
            navigate('/users');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar el usuario');
        } finally {
            setLoading(false);
        }
    };

    if (!user && !error) {
        return (
            <AppLayout backTo="/users" backLabel="Volver a usuarios" maxWidth="sm">
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
                    <CircularProgress />
                </Box>
            </AppLayout>
        );
    }

    return (
        <AppLayout backTo="/users" backLabel="Volver a usuarios" maxWidth="sm">
            <Paper sx={{ p: { xs: 3, sm: 4 } }}>
                <Typography variant="h5" component="h1" mb={0.5}>
                    Editar usuario
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Actualiza los datos de la cuenta.
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
                                {loading ? 'Actualizando...' : 'Guardar cambios'}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Paper>
        </AppLayout>
    );
};

export default EditUserPage;
