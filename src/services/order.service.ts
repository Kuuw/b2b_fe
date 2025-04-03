import api from './api.config';
import { Order, OrderCreate, OrderUpdate } from '../models/order';

export const getOrders = async () => {
    const response = await api.get('/Order');
    return response.data;
};

export const getOrder = async (id: string) => {
    const response = await api.get(`/Order/${id}`);
    return response.data;
};

export const createOrder = async (order: OrderCreate) => {
    const response = await api.post('/Order', order);
    return response.data;
};

export const updateOrder = async (order: OrderUpdate) => {
    const response = await api.put('/Order', order);
    return response.data;
};

export const deleteOrder = async (id: string) => {
    const response = await api.delete(`/Order/${id}`);
    return response.data;
}; 