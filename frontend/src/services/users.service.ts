import { AxiosError } from 'axios';
import { api, getApiErrorMessage } from './api';

export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

export interface CreateUserData {
    username: string;
    email: string;
    role: string;
    password: string;
}

export class UserError extends Error {
    constructor(message: string, public status?: number) {
        super(message);
        this.name = 'UserError';
    }
}

const toUserError = (error: unknown, fallback: string): UserError => {
    if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 403) {
            return new UserError('No tienes permisos para realizar esta acción', 403);
        }
        if (status === 404) {
            return new UserError('Usuario no encontrado', 404);
        }
        return new UserError(getApiErrorMessage(error, fallback), status);
    }
    return new UserError(fallback);
};

export const getUsers = async (): Promise<User[]> => {
    try {
        const response = await api.get('/users/');
        return response.data;
    } catch (error) {
        throw toUserError(error, 'Error al obtener los usuarios');
    }
};

export const deleteUser = async (id: number): Promise<void> => {
    try {
        await api.delete(`/users/${id}/`);
    } catch (error) {
        throw toUserError(error, 'Error al eliminar el usuario');
    }
};

export const createUser = async (userData: CreateUserData): Promise<User> => {
    try {
        // El backend exige confirmación de contraseña (password2)
        const response = await api.post('/users/', { ...userData, password2: userData.password });
        return response.data;
    } catch (error) {
        throw toUserError(error, 'Error al crear el usuario');
    }
};

export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
    try {
        const response = await api.patch(`/users/${id}/`, userData);
        return response.data;
    } catch (error) {
        throw toUserError(error, 'Error al actualizar el usuario');
    }
};
