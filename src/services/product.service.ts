import api from './api.config';
import { Product, ProductCreate, ProductUpdate } from '../models/product';

export const getProducts = async (page = 1, pageSize = 10, search?: string) => {
    const response = await api.post('/Product/GetPaged', {
        page,
        pageSize
    });
    return response.data;
};

export const getProductById = async (id: string) => {
    const response = await api.get(`/Product/${id}`);
    return response.data;
};

export const createProduct = async (product: ProductCreate) => {
    const response = await api.post('/Product', product);
    return response.data;
};

export const updateProduct = async (product: ProductUpdate) => {
    const response = await api.put('/Product', product);
    return response.data;
};

export const deleteProduct = async (id: string) => {
    const response = await api.delete(`/Product/${id}`);
    return response.data;
};

export const getPaged = async (page = 1, limit = 10, filter?: string) => {
    const response = await api.post('/Product/GetPaged', {
        page,
        limit
    });
    return response.data;
}