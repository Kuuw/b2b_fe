import api from './api.config';
import { Country } from '../models/common';

export const getCountries = async () => {
    const response = await api.get('/Country');
    return response.data;
};

export const getCountry = async (id: string) => {
    const response = await api.get(`/Country/${id}`);
    return response.data;
};

export const createCountry = async (country: Omit<Country, 'countryId'>) => {
    const response = await api.post('/Country', country);
    return response.data;
};

export const updateCountry = async (country: Country) => {
    const response = await api.put('/Country', country);
    return response.data;
};

export const deleteCountry = async (id: string) => {
    const response = await api.delete(`/Country/${id}`);
    return response.data;
}; 