import React, { createContext, useContext, useState, useEffect } from 'react';
import { signin } from '../services/auth.service';
import Cookies from 'js-cookie';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            // TODO: Validate token with backend
            // For now, we'll decode the token to get user info
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                        .join('')
                );
                const payload = JSON.parse(jsonPayload);
                setUser({
                    id: payload.UserId,
                    firstName: payload.FirstName,
                    lastName: payload.LastName,
                    role: payload.Role,
                    token: token
                });
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error decoding token:', error);
                Cookies.remove('token');
            }
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await signin({ email, password });
            console.log('Response:', response);
            const userData = response;
            setUser(userData);
            setIsAuthenticated(true);
            Cookies.set('token', userData.token, { expires: 7 });
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        Cookies.remove('token');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
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