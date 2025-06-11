import axios, { AxiosError } from 'axios';
import { getAuth } from './auth.service';
import { validateInventory } from '../utils/validations';

const API_URL = 'http://localhost:8000/api/inventory/';

export interface Inventory {
  id: number;
  product: number;
  company: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CreateInventoryData {
  product: number;
  company: number;
  quantity: number;
}

export class InventoryError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'InventoryError';
  }
}

export const getInventory = async (): Promise<Inventory[]> => {
  try {
    const auth = getAuth();
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: auth ? `Bearer ${auth.access}` : '',
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new InventoryError('No autorizado para ver el inventario', 401);
      }
      throw new InventoryError(error.response?.data?.detail || 'Error al obtener el inventario', error.response?.status);
    }
    throw new InventoryError('Error inesperado al obtener el inventario');
  }
};

export const createInventory = async (data: CreateInventoryData): Promise<Inventory> => {
  try {
    // Validar datos antes de enviar al backend
    validateInventory(data);

    const auth = getAuth();
    const response = await axios.post(API_URL, data, {
      headers: {
        Authorization: auth ? `Bearer ${auth.access}` : '',
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof InventoryError) {
      throw error;
    }
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        throw new InventoryError('Datos de inventario inválidos', 400);
      }
      if (error.response?.status === 401) {
        throw new InventoryError('No autorizado para crear registros de inventario', 401);
      }
      throw new InventoryError(error.response?.data?.detail || 'Error al crear el registro de inventario', error.response?.status);
    }
    throw new InventoryError('Error inesperado al crear el registro de inventario');
  }
};

export const updateInventory = async (id: number, data: CreateInventoryData): Promise<Inventory> => {
  try {
    // Validar datos antes de enviar al backend
    validateInventory(data);

    const auth = getAuth();
    const response = await axios.put(`${API_URL}${id}/`, data, {
      headers: {
        Authorization: auth ? `Bearer ${auth.access}` : '',
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof InventoryError) {
      throw error;
    }
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        throw new InventoryError('Datos de inventario inválidos', 400);
      }
      if (error.response?.status === 401) {
        throw new InventoryError('No autorizado para actualizar registros de inventario', 401);
      }
      if (error.response?.status === 404) {
        throw new InventoryError('Registro de inventario no encontrado', 404);
      }
      throw new InventoryError(error.response?.data?.detail || 'Error al actualizar el registro de inventario', error.response?.status);
    }
    throw new InventoryError('Error inesperado al actualizar el registro de inventario');
  }
};

export const deleteInventory = async (id: number): Promise<void> => {
  try {
    const auth = getAuth();
    await axios.delete(`${API_URL}${id}/`, {
      headers: {
        Authorization: auth ? `Bearer ${auth.access}` : '',
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new InventoryError('No autorizado para eliminar registros de inventario', 401);
      }
      if (error.response?.status === 404) {
        throw new InventoryError('Registro de inventario no encontrado', 404);
      }
      throw new InventoryError(error.response?.data?.detail || 'Error al eliminar el registro de inventario', error.response?.status);
    }
    throw new InventoryError('Error inesperado al eliminar el registro de inventario');
  }
}; 