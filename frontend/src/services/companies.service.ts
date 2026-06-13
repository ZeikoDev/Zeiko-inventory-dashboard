import { AxiosError } from 'axios';
import { api, getApiErrorMessage } from './api';
import { validateCompany } from '../utils/validations';

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

const toCompanyError = (error: unknown, fallback: string): CompanyError => {
  if (error instanceof CompanyError) {
    return error;
  }
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    if (status === 403) {
      return new CompanyError('No tienes permisos para realizar esta acción', 403);
    }
    if (status === 404) {
      return new CompanyError('Empresa no encontrada', 404);
    }
    return new CompanyError(getApiErrorMessage(error, fallback), status);
  }
  return new CompanyError(fallback);
};

export const getCompanies = async (): Promise<Company[]> => {
  try {
    const response = await api.get('/companies/');
    return response.data;
  } catch (error) {
    throw toCompanyError(error, 'Error al obtener las empresas');
  }
};

export const createCompany = async (data: CreateCompanyData): Promise<Company> => {
  try {
    // Validar datos antes de enviar al backend
    validateCompany(data);

    const response = await api.post('/companies/', data);
    return response.data;
  } catch (error) {
    throw toCompanyError(error, 'Error al crear la empresa');
  }
};

export const updateCompany = async (id: number, data: CreateCompanyData): Promise<Company> => {
  try {
    // Validar datos antes de enviar al backend
    validateCompany(data);

    const response = await api.put(`/companies/${id}/`, data);
    return response.data;
  } catch (error) {
    throw toCompanyError(error, 'Error al actualizar la empresa');
  }
};

export const deleteCompany = async (id: number): Promise<void> => {
  try {
    await api.delete(`/companies/${id}/`);
  } catch (error) {
    throw toCompanyError(error, 'Error al eliminar la empresa');
  }
};
