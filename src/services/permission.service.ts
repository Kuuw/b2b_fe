import api from './api.config';
import { Permission } from '../models/role';

export const getPermissions = async () => {
    const response = await api.get('/Permission');
    return response.data;
};

export const getPermission = async (id: string) => {
    const response = await api.get(`/Permission/${id}`);
    return response.data;
};

export const createPermission = async (permission: Omit<Permission, 'permissionId'>) => {
    const response = await api.post('/Permission', permission);
    return response.data;
};

export const updatePermission = async (permission: Permission) => {
    const response = await api.put('/Permission', permission);
    return response.data;
};

export const deletePermission = async (id: string) => {
    const response = await api.delete(`/Permission/${id}`);
    return response.data;
}; 