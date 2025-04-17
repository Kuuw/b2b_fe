import api from './api.config';

export const getAdminProducts = async () => {
    const response = await api.get('/Admin/Products');
    return response.data;
};

export const getAdminCategories = async () => {
    const response = await api.get('/Admin/Categories');
    return response.data;
};

export const getAdminImages = async () => {
    const response = await api.get('/Admin/Images');
    return response.data;
};

export const getAdminProductById = async (id: string) => {
    const response = await api.get(`/Admin/Products/${id}`);
    return response.data;
};

export const getAdminCategoryById = async (id: string) => {
    const response = await api.get(`/Admin/Categories/${id}`);
    return response.data;
}; 