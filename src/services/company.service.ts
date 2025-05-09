import api from './api.config';
import { Company, CompanyCreate, CompanyUpdate } from '../models/company';

export const getCompanies = async (page: number, pageSize: number) => {
    const response = await api.get('/Company/GetPaged', {
        params: { page, pageSize },
    });
    return response.data;
};

export const getCompany = async (id: string) => {
    const response = await api.get(`/Company/${id}`);
    return response.data;
};

export const createCompany = async (company: CompanyCreate) => {
    const response = await api.post('/Company', company);
    return response.data;
};

export const updateCompany = async (company: CompanyUpdate) => {
    const response = await api.put('/Company', company);
    return response.data;
};

export const getReports = async (page: number, pageSize: number) => {
    const response = await api.get('/Company/GetReports', {
        params: { page, pageSize },
    });
    return response.data;
}

export const deleteCompany = async (id: string) => {
    const response = await api.delete(`/Company/${id}`);
    return response.data;
}; 