import axios, { AxiosError } from 'axios';
import { getAuth } from './auth.service';
import { validateProduct } from '../utils/validations';

const API_URL = 'http://localhost:8000/api/products/';

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

export const getProducts = async (): Promise<Product[]> => {
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
        throw new ProductError('No autorizado para ver los productos', 401);
      }
      throw new ProductError(error.response?.data?.detail || 'Error al obtener los productos', error.response?.status);
    }
    throw new ProductError('Error inesperado al obtener los productos');
  }
};

export const createProduct = async (data: CreateProductData): Promise<Product> => {
  try {
    // Validar datos antes de enviar al backend
    validateProduct(data);

    const auth = getAuth();
    const response = await axios.post(API_URL, data, {
      headers: {
        Authorization: auth ? `Bearer ${auth.access}` : '',
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof ProductError) {
      throw error;
    }
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        throw new ProductError('Datos de producto inválidos', 400);
      }
      if (error.response?.status === 401) {
        throw new ProductError('No autorizado para crear productos', 401);
      }
      throw new ProductError(error.response?.data?.detail || 'Error al crear el producto', error.response?.status);
    }
    throw new ProductError('Error inesperado al crear el producto');
  }
};

export const updateProduct = async (id: number, data: CreateProductData): Promise<Product> => {
  try {
    // Validar datos antes de enviar al backend
    validateProduct(data);

    const auth = getAuth();
    const response = await axios.put(`${API_URL}${id}/`, data, {
      headers: {
        Authorization: auth ? `Bearer ${auth.access}` : '',
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof ProductError) {
      throw error;
    }
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        throw new ProductError('Datos de producto inválidos', 400);
      }
      if (error.response?.status === 401) {
        throw new ProductError('No autorizado para actualizar productos', 401);
      }
      if (error.response?.status === 404) {
        throw new ProductError('Producto no encontrado', 404);
      }
      throw new ProductError(error.response?.data?.detail || 'Error al actualizar el producto', error.response?.status);
    }
    throw new ProductError('Error inesperado al actualizar el producto');
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
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
        throw new ProductError('No autorizado para eliminar productos', 401);
      }
      if (error.response?.status === 404) {
        throw new ProductError('Producto no encontrado', 404);
      }
      throw new ProductError(error.response?.data?.detail || 'Error al eliminar el producto', error.response?.status);
    }
    throw new ProductError('Error inesperado al eliminar el producto');
  }
}; 