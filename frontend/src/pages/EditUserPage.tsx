import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getUsers, updateUser, type User } from '../services/users.service';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
            setError('Error al actualizar el usuario');
        } finally {
            setLoading(false);
        }
    };

    if (!user && !error) return <Typography>Cargando...</Typography>;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                bgcolor: 'background.default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
                py: 4,
                position: 'relative',
            }}
        >
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/users')}
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
                Volver a Usuarios
            </Button>
            <Box sx={{ maxWidth: 400, mx: 'auto', p: 4, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 3 }}>
                <Typography variant="h4" mb={3} color="primary.main" fontWeight={700}>Editar Usuario</Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Usuario"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <TextField
                        label="Correo"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <TextField
                        select
                        label="Rol"
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    >
                        {roles.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3 }}
                        disabled={loading}
                    >
                        {loading ? 'Actualizando...' : 'Actualizar Usuario'}
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default EditUserPage; 