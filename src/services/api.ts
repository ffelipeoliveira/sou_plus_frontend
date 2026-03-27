import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface BackendUser {
    id: number;
    username: string;
    email: string;
    fullName: string;
    profilePicture: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    fullName: string;
}

export const authApi = {
    login: async (credentials: LoginCredentials) => {
        const response = await api.post('/auth/login', credentials);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        return user as BackendUser;
    },
    
    register: async (data: RegisterData) => {
        const response = await api.post('/auth/register', data);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        return user as BackendUser;
    },
    
    logout: () => {
        localStorage.removeItem('token');
    }
};

export const userApi = {
    getCurrentUser: async () => {
        const response = await api.get('/users/me');
        return response.data as BackendUser;
    },
    
    updateProfile: async (data: Partial<BackendUser>) => {
        const response = await api.put('/users/me', data);
        return response.data as BackendUser;
    }
};

export default api;