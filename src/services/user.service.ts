import api from './api.config';
import { User, UserCreate, UserUpdate } from '../models/user';

export const getUsers = async () => {
    const response = await api.get('/User');
    return response.data;
};

export const getUser = async (id: string) => {
    const response = await api.get(`/User/${id}`);
    return response.data;
};

export const createUser = async (user: UserCreate) => {
    const response = await api.post('/User', user);
    return response.data;
};

export const updateUser = async (user: UserUpdate) => {
    const response = await api.put('/User', user);
    return response.data;
}; 