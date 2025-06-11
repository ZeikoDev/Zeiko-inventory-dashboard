import axios, { AxiosError } from 'axios';
import { getAuth } from './auth.service';
import { validateCompany } from '../utils/validations';

const API_URL = 'http://localhost:8000/api/companies/';

export interface Company {
  id: number;
  nit: string;
  name: string;
  address: string;
  phone: string;
  user: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCompanyData {
  nit: string;
  name: string;
  address: string;
  phone: string;
}

export class CompanyError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'CompanyError';
  }
}

export const getCompanies = async (): Promise<Company[]> => {
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
        throw new CompanyError('No autorizado para ver las empresas', 401);
      }
      throw new CompanyError(error.response?.data?.detail || 'Error al obtener las empresas', error.response?.status);
    }
    throw new CompanyError('Error inesperado al obtener las empresas');
  }
};

export const createCompany = async (data: CreateCompanyData): Promise<Company> => {
  try {
    // Validar datos antes de enviar al backend
    validateCompany(data);

    const auth = getAuth();
    const response = await axios.post(API_URL, data, {
      headers: {
        Authorization: auth ? `Bearer ${auth.access}` : '',
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof CompanyError) {
      throw error;
    }
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        throw new CompanyError('Datos de empresa inválidos', 400);
      }
      if (error.response?.status === 401) {
        throw new CompanyError('No autorizado para crear empresas', 401);
      }
      throw new CompanyError(error.response?.data?.detail || 'Error al crear la empresa', error.response?.status);
    }
    throw new CompanyError('Error inesperado al crear la empresa');
  }
};

export const updateCompany = async (id: number, data: CreateCompanyData): Promise<Company> => {
  try {
    // Validar datos antes de enviar al backend
    validateCompany(data);

    const auth = getAuth();
    const response = await axios.put(`${API_URL}${id}/`, data, {
      headers: {
        Authorization: auth ? `Bearer ${auth.access}` : '',
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof CompanyError) {
      throw error;
    }
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        throw new CompanyError('Datos de empresa inválidos', 400);
      }
      if (error.response?.status === 401) {
        throw new CompanyError('No autorizado para actualizar empresas', 401);
      }
      if (error.response?.status === 404) {
        throw new CompanyError('Empresa no encontrada', 404);
      }
      throw new CompanyError(error.response?.data?.detail || 'Error al actualizar la empresa', error.response?.status);
    }
    throw new CompanyError('Error inesperado al actualizar la empresa');
  }
};

export const deleteCompany = async (id: number): Promise<void> => {
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
        throw new CompanyError('No autorizado para eliminar empresas', 401);
      }
      if (error.response?.status === 404) {
        throw new CompanyError('Empresa no encontrada', 404);
      }
      throw new CompanyError(error.response?.data?.detail || 'Error al eliminar la empresa', error.response?.status);
    }
    throw new CompanyError('Error inesperado al eliminar la empresa');
  }
}; 