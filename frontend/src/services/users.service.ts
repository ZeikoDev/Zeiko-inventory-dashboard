import axios from 'axios';
import { getAuth } from './auth.service';

export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

const API_URL = 'http://localhost:8000/api';

export const getUsers = async (): Promise<User[]> => {
    const auth = getAuth();
    if (!auth) throw new Error('No autenticado');

    const response = await axios.get(`${API_URL}/users/`, {
        headers: {
            Authorization: `Bearer ${auth.access}`,
        },
    });
    return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
    const auth = getAuth();
    if (!auth) throw new Error('No autenticado');

    await axios.delete(`${API_URL}/users/${id}/`, {
        headers: {
            Authorization: `Bearer ${auth.access}`,
        },
    });
};

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
    const auth = getAuth();
    if (!auth) throw new Error('No autenticado');

    const response = await axios.post(`${API_URL}/users/`, userData, {
        headers: {
            Authorization: `Bearer ${auth.access}`,
        },
    });
    return response.data;
};

export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
    const auth = getAuth();
    if (!auth) throw new Error('No autenticado');

    const response = await axios.patch(`${API_URL}/users/${id}/`, userData, {
        headers: {
            Authorization: `Bearer ${auth.access}`,
        },
    });
    return response.data;
}; 