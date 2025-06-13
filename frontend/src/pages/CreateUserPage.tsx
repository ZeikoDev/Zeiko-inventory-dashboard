import { useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../services/users.service';

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
            setError('Error al crear el usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 4, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h4" mb={3} color="primary.main" fontWeight={700}>Crear Usuario</Typography>
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
                    label="Contraseña"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
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
                    {loading ? 'Creando...' : 'Crear Usuario'}
                </Button>
            </form>
        </Box>
    );
};

export default CreateUserPage; 