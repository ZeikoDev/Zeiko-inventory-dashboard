import { AxiosError } from 'axios';
import { api, getApiErrorMessage } from './api';
import { validateProduct } from '../utils/validations';

export interface Product {
  id: number;
  code: string;
  name: string;
  characteristics: string;
  price_usd: number;
  price_eur: number;
  price_cop: number;
  company: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProductData {
  code: string;
  name: string;
  characteristics: string;
  price_usd: number;
  price_eur: number;
  price_cop: number;
  company: number;
}

export class ProductError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ProductError';
  }
}

const toProductError = (error: unknown, fallback: string): ProductError => {
  if (error instanceof ProductError) {
    return error;
  }
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    if (status === 403) {
      return new ProductError('No tienes permisos para realizar esta acción', 403);
    }
    if (status === 404) {
      return new ProductError('Producto no encontrado', 404);
    }
    return new ProductError(getApiErrorMessage(error, fallback), status);
  }
  return new ProductError(fallback);
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get('/products/');
    return response.data;
  } catch (error) {
    throw toProductError(error, 'Error al obtener los productos');
  }
};

export const createProduct = async (data: CreateProductData): Promise<Product> => {
  try {
    // Validar datos antes de enviar al backend
    validateProduct(data);

    const response = await api.post('/products/', data);
    return response.data;
  } catch (error) {
    throw toProductError(error, 'Error al crear el producto');
  }
};

export const updateProduct = async (id: number, data: CreateProductData): Promise<Product> => {
  try {
    // Validar datos antes de enviar al backend
    validateProduct(data);

    const response = await api.put(`/products/${id}/`, data);
    return response.data;
  } catch (error) {
    throw toProductError(error, 'Error al actualizar el producto');
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await api.delete(`/products/${id}/`);
  } catch (error) {
    throw toProductError(error, 'Error al eliminar el producto');
  }
};
