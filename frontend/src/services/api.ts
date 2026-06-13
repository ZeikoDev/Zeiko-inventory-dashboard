import axios, { AxiosError } from 'axios';

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Adjunta el token de acceso a cada petición
api.interceptors.request.use((config) => {
  try {
    const data = localStorage.getItem('auth');
    const auth = data ? JSON.parse(data) : null;
    if (auth?.access) {
      config.headers.Authorization = `Bearer ${auth.access}`;
    }
  } catch {
    // Sesión corrupta: se limpia en el interceptor de respuesta si el backend rechaza
  }
  return config;
});

// Sesión expirada o inválida: limpiar y volver al login
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isLoginRequest = error.config?.url?.includes('/token/');
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('auth');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

interface BackendError {
  error?: { message?: string; details?: unknown };
  detail?: string;
}

/**
 * Extrae un mensaje legible del formato de error del backend
 * ({error: {message, details}}) o del formato `detail` de DRF.
 */
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as BackendError | undefined;
    if (data?.error?.message && data.error.message !== 'Validation error.') {
      return data.error.message;
    }
    if (data?.error?.details && typeof data.error.details === 'object') {
      const details = data.error.details as Record<string, unknown>;
      const firstKey = Object.keys(details)[0];
      const value = details[firstKey];
      const text = Array.isArray(value) ? value[0] : value;
      if (typeof text === 'string') {
        return firstKey === 'non_field_errors' ? text : `${firstKey}: ${text}`;
      }
    }
    if (data?.detail) {
      return data.detail;
    }
  }
  return fallback;
};
