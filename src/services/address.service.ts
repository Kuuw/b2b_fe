import api from './api.config';
import { Address } from '../models/common';
import { AddressCreate } from '../models/company';

export const getAddresses = async () => {
    const response = await api.get('/Address');
    return response.data;
};

export const getSelfAddresses = async () => {
    const response = await api.get('/Address/GetSelf');
    return response.data;
};

export const getAddress = async (id: string) => {
    const response = await api.get(`/Address/${id}`);
    return response.data;
};

export const getAddressesByCompany = async (companyId: string) => {
    const response = await api.get(`/Address/CompanyId/${companyId}`);
    return response.data;
};

export const getAddressesByUser = async (userId: string) => {
    const response = await api.get(`/Address/UserId/${userId}`);
    return response.data;
};

export const createAddress = async (address: AddressCreate) => {
    const response = await api.post('/Address', address);
    return response.data;
};

export const updateAddress = async (address: Address) => {
    const response = await api.put('/Address', address);
    return response.data;
};

export const deleteAddress = async (id: string) => {
    const response = await api.delete(`/Address/${id}`);
    return response.data;
}; 