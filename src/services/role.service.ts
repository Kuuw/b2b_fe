import api from './api.config';
import { Role, RoleCreate, RoleUpdate } from '../models/role';

export const getRoles = async () => {
    const response = await api.get('/Role/GetAll');
    return response.data;
};

export const getRole = async (id: string) => {
    const response = await api.get(`/Role/${id}`);
    return response.data;
};

export const createRole = async (role: RoleCreate) => {
    const response = await api.post('/Role', role);
    return response.data;
};

export const updateRole = async (role: RoleUpdate) => {
    const response = await api.put('/Role', role);
    return response.data;
};

export const deleteRole = async (id: string) => {
    const response = await api.delete(`/Role/${id}`);
    return response.data;
}; 