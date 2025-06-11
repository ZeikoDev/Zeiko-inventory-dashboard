import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress } from '@mui/material';
import { getInventory } from '../services/inventory.service';
import type { Inventory } from '../services/inventory.service';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import { deleteInventory } from '../services/inventory.service';
import { getAuth } from '../services/auth.service';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { getProducts, type Product } from '../services/products.service';
import { getCompanies, type Company } from '../services/companies.service';

const InventoryPage = () => {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Inventory | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();
  const userRole = auth?.role;
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [pdfMessage, setPdfMessage] = useState('');
  const [pdfError, setPdfError] = useState('');

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const [inventoryData, productsData, companiesData] = await Promise.all([
        getInventory(),
        getProducts(),
        getCompanies()
      ]);
      setInventory(inventoryData);
      setProducts(productsData);
      setCompanies(companiesData);
    } catch (err) {
      setError('Error al cargar el inventario');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleDeleteClick = (item: Inventory) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setLoading(true);
    try {
      await deleteInventory(itemToDelete.id);
      await fetchInventory();
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (err) {
      setError('Error al eliminar el registro de inventario');
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Producto no encontrado';
  };

  const getCompanyName = (companyId: number) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'Empresa no encontrada';
  };

  const handleSendPdf = async () => {
    setPdfMessage('');
    setPdfError('');
    setPdfDialogOpen(true);
    try {
      await axios.get('http://localhost:8000/api/inventory/send-pdf/', {
        headers: {
          Authorization: auth ? `Bearer ${auth.access}` : '',
        },
      });
      setPdfMessage('El PDF fue enviado al correo correctamente (simulado).');
    } catch (err: any) {
      setPdfError('No se pudo enviar el PDF al correo.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', px: 2, py: 6, position: 'relative' }}>
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
      <Box sx={{ width: '100%', maxWidth: 1200, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" color="primary.main" fontWeight={600} letterSpacing={1}>
            Inventario
          </Typography>
          {userRole === 'admin' && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/inventory/create')}
              sx={{
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                py: 1,
                boxShadow: '0 0 16px 0 #00e1ff55',
              }}
            >
              Agregar al Inventario
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'primary.main', fontWeight: 700 }}>Producto</TableCell>
                  <TableCell sx={{ color: 'primary.main', fontWeight: 700 }}>Empresa</TableCell>
                  <TableCell sx={{ color: 'primary.main', fontWeight: 700 }}>Cantidad</TableCell>
                  <TableCell sx={{ color: 'primary.main', fontWeight: 700 }}>Última actualización</TableCell>
                  {userRole === 'admin' && <TableCell sx={{ color: 'primary.main', fontWeight: 700 }}>Acciones</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{getProductName(item.product)}</TableCell>
                    <TableCell>{getCompanyName(item.company)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{new Date(item.updated_at).toLocaleDateString()}</TableCell>
                    {userRole === 'admin' && (
                      <TableCell>
                        <Button size="small" color="primary" onClick={() => navigate(`/inventory/edit/${item.id}`)} sx={{ minWidth: 0, mr: 1 }}>
                          <EditIcon />
                        </Button>
                        <Button size="small" color="error" onClick={() => handleDeleteClick(item)} sx={{ minWidth: 0 }}>
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Box>

      {userRole === 'admin' && (
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{ sx: { bgcolor: 'background.paper', borderRadius: 2 } }}
        >
          <DialogTitle sx={{ color: 'primary.main', fontWeight: 600 }}>
            Confirmar Eliminación
          </DialogTitle>
          <DialogContent>
            <Typography>
              ¿Está seguro que desea eliminar este registro de inventario?
              Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setDeleteDialogOpen(false)} sx={{ fontWeight: 600 }}>
              Cancelar
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={loading} sx={{ fontWeight: 600 }}>
              {loading ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Dialog open={pdfDialogOpen} onClose={() => setPdfDialogOpen(false)}>
        <DialogTitle>Enviar PDF al correo</DialogTitle>
        <DialogContent>
          {pdfError ? (
            <Alert severity="error">{pdfError}</Alert>
          ) : (
            <Alert severity="success">{pdfMessage || 'Enviando PDF...'}</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPdfDialogOpen(false)} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryPage; 