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

interface ReportFilter {
    search?: string;
    users: string[];
    startDate?: string | null;
    endDate?: string | null;
    minSpent?: number | null;
    maxSpent?: number | null;
    minOrder?: number | null;
    maxOrder?: number | null;
}

export const getReports = async (pageNumber: number, pageSize: number, filter: ReportFilter) => {
    const response = await api.post('/Company/GetReports', {
        pageNumber,
        pageSize,
        filter
    });
    return response.data;
}

export const deleteCompany = async (id: string) => {
    const response = await api.delete(`/Company/${id}`);
    return response.data;
}; 