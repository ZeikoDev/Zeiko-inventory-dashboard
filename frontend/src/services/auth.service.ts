import { AxiosError } from 'axios';
import { api, getApiErrorMessage } from './api';
import { validateLogin } from '../utils/validations';

export interface AuthResponse {
  access: string;
  refresh: string;
  username?: string;
  role?: string;
}

export class AuthError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'AuthError';
  }
}

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    // Validar datos antes de enviar al backend
    validateLogin({ username, password });

    const response = await api.post('/token/', { username, password });
    return response.data;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new AuthError('Usuario o contraseña incorrectos', 401);
      }
      if (error.response?.status === 429) {
        throw new AuthError('Demasiados intentos. Espera un momento e inténtalo de nuevo', 429);
      }
      throw new AuthError(getApiErrorMessage(error, 'Error en la autenticación'), error.response?.status);
    }
    throw new AuthError('Error inesperado en la autenticación');
  }
};

export const saveAuth = (data: AuthResponse) => {
  try {
    localStorage.setItem('auth', JSON.stringify(data));
  } catch (error) {
    throw new AuthError('Error al guardar la sesión');
  }
};

export const getAuth = (): AuthResponse | null => {
  try {
    const data = localStorage.getItem('auth');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error al obtener la sesión:', error);
    return null;
  }
};

export const logout = () => {
  try {
    localStorage.removeItem('auth');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};
