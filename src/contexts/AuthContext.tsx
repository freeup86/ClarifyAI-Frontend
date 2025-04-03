import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/api';
import { jwtDecode } from 'jwt-decode';

interface User {
    id: number;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

interface JwtPayload {
    sub: string; // user email
    user_id: number;
    exp: number;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode<JwtPayload>(token);

                // Check if token is expired
                const currentTime = Date.now() / 1000;
                if (decoded.exp < currentTime) {
                    localStorage.removeItem('token');
                } else {
                    setUser({ id: decoded.user_id, email: decoded.sub });
                }
            } catch (error) {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, userId, email: userEmail } = response.data;

            localStorage.setItem('token', token);
            setUser({ id: userId, email: userEmail });
        } catch (error) {
            throw new Error('Invalid email or password');
        }
    };

    const register = async (email: string, password: string, firstName?: string, lastName?: string) => {
        try {
            const response = await api.post('/auth/register', { email, password, firstName, lastName });
            const { token, userId, email: userEmail } = response.data;

            localStorage.setItem('token', token);
            setUser({ id: userId, email: userEmail });
        } catch (error) {
            throw new Error('Registration failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);