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

export const selfGetOrder = async () => {
    const response = await api.get(`/Order`);
    return response.data;
};

export const selfGetOrderOne = async (id: string) => {
    const response = await api.get(`/Order/GetOne/${id}`);
    return response.data;
};

export const createOrder = async (order: OrderCreate) => {
    const response = await api.post('/Order', order);
    return response.data;
};

export const selfCreateOrder = async (order: OrderCreate) => {
    const response = await api.post('/Order/Create', order);
    return response.data;
}

export const updateOrder = async (order: OrderUpdate) => {
    const response = await api.put('/Order', order);
    return response.data;
};

export const deleteOrder = async (id: string) => {
    const response = await api.delete(`/Order/${id}`);
    return response.data;
};

export const getOrdersAdmin = async (page: number, pageSize: number, StatusId: string) => {
    const response = await api.get('/Order/GetPaged', {
        params: { page, pageSize, StatusId },
    });
    return response.data;
}