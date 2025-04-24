import api from './api.config';
import { Status } from '../models/status';

export const getStatuses = async () => {
    const response = await api.get('/Status/GetAll');
    return response.data;
};

export const getStatus = async (id: string) => {
    const response = await api.get(`/Status/${id}`);
    return response.data;
};

export const createStatus = async (status: Omit<Status, 'statusId'>) => {
    const response = await api.post('/Status', status);
    return response.data;
};

export const updateStatus = async (status: Status) => {
    const response = await api.put('/Status', status);
    return response.data;
};

export const deleteStatus = async (id: string) => {
    const response = await api.delete(`/Status/${id}`);
    return response.data;
}; 