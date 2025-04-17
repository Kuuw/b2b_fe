import api from './api.config';

export const getCategory = async (id: string) => {
    const response = await api.get(`/Category/${id}`);
    return response.data;
};

export const getCategories = async (page = 1, pageSize = 20) => {
    const response = await api.get('/Category', {
        params: {
            page,
            pageSize
        }
    });
    return response.data;
}