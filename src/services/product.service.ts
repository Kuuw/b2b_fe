import api from './api.config';
import { Product, ProductCreate, ProductUpdate } from '../models/product';

export const getProducts = async (pageNumber = 1, pageSize = 10, Filter?: filter) => {
    const response = await api.post('/Product/GetPaged', {
        pageNumber,
        pageSize,
        Filter
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

export interface filter {
    productName?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    minStock?: number;
    maxStock?: number;
}