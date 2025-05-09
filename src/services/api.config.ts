import axios from 'axios';
import cookies from 'react-cookies';

const API_URL = import.meta.env.VITE_REACT_APP_API_ENDPOINT || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = cookies.load('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            cookies.remove('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api; 