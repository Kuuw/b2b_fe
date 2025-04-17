import React, { createContext, useContext, useState, useEffect } from 'react';
import { signin } from '../services/auth.service';

interface User {
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
        const token = localStorage.getItem('token');
        if (token) {
            // TODO: Validate token with backend
            setIsAuthenticated(true);
        }
    }, []);

    const login = async (email: string, password: string) => {
        var loginRequest = signin({ email, password });
        loginRequest.then((response) => {
            if (response.status === 200) {
                const userData = response.data;
                setUser(userData);
                setIsAuthenticated(true);
                localStorage.setItem('token', userData.token);
            } else {
                throw new Error('Invalid credentials');
            }
        }).catch((error) => {
            console.error('Login failed', error);
            throw error;
        });
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
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