import api from './api.config';
import cookies from 'react-cookies';
import { UserLogin, UserRegister } from '../models/user';

export const signin = async (credentials: UserLogin) => {
    const response = await api.post('/Auth/Login', credentials);
    return response.data;
};

export const register = async (userData: UserRegister) => {
    const response = await api.post('/Auth/Register', userData);
    return response.data;
};

export const logout = () => {
    cookies.remove('token', { path: '/' });
}; 