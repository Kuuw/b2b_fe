import api from './api.config';
import cookies from 'react-cookies';
import { UserLogin, UserRegister } from '../models/user';

export const login = async (credentials: UserLogin) => {
    const response = await api.post('/Auth/Login', credentials);
    if (response.data.token) {
        cookies.save('token', response.data.token, { path: '/' });
    }
    return response.data;
};

export const register = async (userData: UserRegister) => {
    const response = await api.post('/Auth/Register', userData);
    return response.data;
};

export const logout = () => {
    cookies.remove('token', { path: '/' });
}; 