import { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getUsers, deleteUser, type User } from '../services/users.service';
import { getAuth } from '../services/auth.service';
import { Table } from '../components/organisms/Table';
import { Card } from '../components/atoms/Card';

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const navigate = useNavigate();
    const auth = getAuth();
    const userRole = auth?.role;

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            setError('Error al cargar los usuarios');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;

        setLoading(true);
        try {
            await deleteUser(userToDelete.id);
            await fetchUsers();
            setDeleteDialogOpen(false);
            setUserToDelete(null);
        } catch (err) {
            setError('Error al eliminar el usuario');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { id: 'username', label: 'Usuario' },
        { id: 'email', label: 'Correo' },
        { id: 'role', label: 'Rol' },
        ...(userRole === 'admin' ? [{
            id: 'actions',
            label: 'Acciones',
            render: (_: unknown, row: User) => (
                <Box>
                    <IconButton
                        color="primary"
                        onClick={() => navigate(`/users/edit/${row.id}`)}
                        sx={{ mr: 1 }}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(row)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            )
        }] : [])
    ];

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
            <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography
                        variant="h4"
                        color="primary.main"
                        fontWeight={700}
                        letterSpacing={1}
                    >
                        Usuarios
                    </Typography>
                    {userRole === 'admin' && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/users/create')}
                            sx={{
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 3,
                                py: 1,
                                boxShadow: '0 0 16px 0 #00e1ff55',
                            }}
                        >
                            Crear Usuario
                        </Button>
                    )}
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Card>
                    <Table
                        columns={columns}
                        data={users}
                    />
                </Card>
            </Box>

            {userRole === 'admin' && (
                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    PaperProps={{
                        sx: {
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                        }
                    }}
                >
                    <DialogTitle sx={{ color: 'primary.main', fontWeight: 600 }}>
                        Confirmar Eliminación
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            ¿Está seguro que desea eliminar el usuario "{userToDelete?.username}"?
                            Esta acción no se puede deshacer.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 2, pt: 0 }}>
                        <Button
                            onClick={() => setDeleteDialogOpen(false)}
                            sx={{ fontWeight: 600 }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleDeleteConfirm}
                            color="error"
                            variant="contained"
                            disabled={loading}
                            sx={{ fontWeight: 600 }}
                        >
                            {loading ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default UsersPage; 