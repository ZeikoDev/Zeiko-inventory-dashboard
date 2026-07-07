import { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getUsers, deleteUser, type User } from '../services/users.service';
import { getAuth } from '../services/auth.service';
import { Table } from '../components/organisms/Table';
import { AppLayout, RoleChip } from '../components/layout/AppLayout';

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
        {
            id: 'role',
            label: 'Rol',
            render: (value: string) => <RoleChip role={value} />
        },
        ...(userRole === 'admin' ? [{
            id: 'actions',
            label: 'Acciones',
            render: (_: unknown, row: User) => (
                <Box sx={{ whiteSpace: 'nowrap' }}>
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/users/edit/${row.id}`)}
                        sx={{ mr: 0.5 }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(row)}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            )
        }] : [])
    ];

    return (
        <AppLayout
            title="Usuarios"
            subtitle="Cuentas y permisos del equipo"
            backTo="/dashboard"
            backLabel="Volver al dashboard"
            maxWidth="md"
            actions={
                userRole === 'admin' ? (
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/users/create')}>
                        Nuevo usuario
                    </Button>
                ) : undefined
            }
        >
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Table
                columns={columns}
                data={users}
            />

            {userRole === 'admin' && (
                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                >
                    <DialogTitle>
                        Confirmar eliminación
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            ¿Está seguro que desea eliminar el usuario "{userToDelete?.username}"?
                            Esta acción no se puede deshacer.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 2, pt: 0 }}>
                        <Button onClick={() => setDeleteDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleDeleteConfirm}
                            color="error"
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </AppLayout>
    );
};

export default UsersPage;
