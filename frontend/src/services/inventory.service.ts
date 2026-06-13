import { AxiosError } from 'axios';
import { api, getApiErrorMessage } from './api';
import { validateInventory } from '../utils/validations';

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

const toInventoryError = (error: unknown, fallback: string): InventoryError => {
  if (error instanceof InventoryError) {
    return error;
  }
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    if (status === 403) {
      return new InventoryError('No tienes permisos para realizar esta acción', 403);
    }
    if (status === 404) {
      return new InventoryError('Registro de inventario no encontrado', 404);
    }
    return new InventoryError(getApiErrorMessage(error, fallback), status);
  }
  return new InventoryError(fallback);
};

export const getInventory = async (): Promise<Inventory[]> => {
  try {
    const response = await api.get('/inventory/');
    return response.data;
  } catch (error) {
    throw toInventoryError(error, 'Error al obtener el inventario');
  }
};

export const createInventory = async (data: CreateInventoryData): Promise<Inventory> => {
  try {
    // Validar datos antes de enviar al backend
    validateInventory(data);

    const response = await api.post('/inventory/', data);
    return response.data;
  } catch (error) {
    throw toInventoryError(error, 'Error al crear el registro de inventario');
  }
};

export const updateInventory = async (id: number, data: CreateInventoryData): Promise<Inventory> => {
  try {
    // Validar datos antes de enviar al backend
    validateInventory(data);

    const response = await api.put(`/inventory/${id}/`, data);
    return response.data;
  } catch (error) {
    throw toInventoryError(error, 'Error al actualizar el registro de inventario');
  }
};

export const deleteInventory = async (id: number): Promise<void> => {
  try {
    await api.delete(`/inventory/${id}/`);
  } catch (error) {
    throw toInventoryError(error, 'Error al eliminar el registro de inventario');
  }
};
