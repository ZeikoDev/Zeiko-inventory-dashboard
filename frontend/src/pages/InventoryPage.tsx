import { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, CircularProgress } from '@mui/material';
import { getInventory } from '../services/inventory.service';
import type { Inventory } from '../services/inventory.service';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import { deleteInventory } from '../services/inventory.service';
import { getAuth } from '../services/auth.service';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { api, getApiErrorMessage } from '../services/api';
import { getProducts, type Product } from '../services/products.service';
import { getCompanies, type Company } from '../services/companies.service';
import { Table } from '../components/organisms/Table';
import { AppLayout } from '../components/layout/AppLayout';

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
      const response = await api.post('/inventory/generate_pdf/', {}, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_inventario_${new Date().toISOString().slice(0, 10)}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      setPdfMessage('El reporte PDF se generó y descargó correctamente.');
    } catch (err) {
      setPdfError(getApiErrorMessage(err, 'No se pudo generar el reporte PDF.'));
    }
  };

  const columns = [
    {
      id: 'product',
      label: 'Producto',
      render: (value: number) => getProductName(value)
    },
    {
      id: 'company',
      label: 'Empresa',
      render: (value: number) => getCompanyName(value)
    },
    { id: 'quantity', label: 'Cantidad' },
    {
      id: 'updated_at',
      label: 'Última actualización',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    ...(userRole === 'admin' ? [{
      id: 'actions',
      label: 'Acciones',
      render: (_: unknown, row: Inventory) => (
        <Box sx={{ whiteSpace: 'nowrap' }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => navigate(`/inventory/edit/${row.id}`)}
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
      title="Inventario"
      subtitle="Stock disponible por producto y empresa"
      backTo="/dashboard"
      backLabel="Volver al dashboard"
      actions={
        <>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfOutlinedIcon />}
            onClick={handleSendPdf}
          >
            Descargar reporte PDF
          </Button>
          {userRole === 'admin' && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/inventory/create')}>
              Agregar al inventario
            </Button>
          )}
        </>
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Table columns={columns} data={inventory} />
      )}

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
              ¿Está seguro que desea eliminar este registro de inventario?
              Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={loading}>
              {loading ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Dialog open={pdfDialogOpen} onClose={() => setPdfDialogOpen(false)}>
        <DialogTitle>Reporte PDF de inventario</DialogTitle>
        <DialogContent>
          {pdfError ? (
            <Alert severity="error">{pdfError}</Alert>
          ) : pdfMessage ? (
            <Alert severity="success">{pdfMessage}</Alert>
          ) : (
            <Alert severity="info">Generando PDF...</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPdfDialogOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
};

export default InventoryPage;
