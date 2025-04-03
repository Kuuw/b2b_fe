import api from './api.config';

export const getCategories = async () => {
    const response = await api.get('/Category/GetAll');
    return response.data;
};

export const getCategory = async (id: string) => {
    const response = await api.get(`/Category/${id}`);
    return response.data;
}; 