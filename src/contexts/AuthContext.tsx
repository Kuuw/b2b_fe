import React, { createContext, useContext, useState, useEffect } from 'react';
import cookies from 'react-cookies';
import { login as authLogin, logout as authLogout } from '../services';
import { UserLogin } from '../models/user';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (data: UserLogin) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const token = cookies.load('token');
        setIsAuthenticated(!!token);
    }, []);

    const login = async (data: UserLogin) => {
        await authLogin(data);
        setIsAuthenticated(true);
    };

    const logout = () => {
        authLogout();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 