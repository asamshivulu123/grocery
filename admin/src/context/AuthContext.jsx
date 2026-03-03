import { createContext, useState, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(
        localStorage.getItem('adminInfo') ? JSON.parse(localStorage.getItem('adminInfo')) : null
    );

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        if (data.role !== 'admin') {
            throw new Error('Access denied. Admin only.');
        }
        setAdmin(data);
        localStorage.setItem('adminInfo', JSON.stringify(data));
    };

    const logout = () => {
        setAdmin(null);
        localStorage.removeItem('adminInfo');
    };

    return (
        <AuthContext.Provider value={{ admin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
