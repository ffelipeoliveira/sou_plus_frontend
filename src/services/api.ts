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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export interface BackendUser {
    id: number;
    username: string;
    email: string;
    fullName: string;
    profilePicture: string;
    createdAt?: string;
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
    login: async (credentials: LoginCredentials): Promise<BackendUser> => {
        const response = await api.post('/auth/login', credentials);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        return user;
    },
    
    register: async (data: RegisterData): Promise<BackendUser> => {
        const response = await api.post('/auth/register', data);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        return user;
    },
    
    logout: () => {
        localStorage.removeItem('token');
    }
};

export const userApi = {
    getCurrentUser: async (): Promise<BackendUser> => {
        const response = await api.get('/users/me');
        return response.data;
    },
    
    updateProfile: async (data: Partial<BackendUser>): Promise<BackendUser> => {
        const response = await api.put('/users/me', data);
        return response.data;
    },
    
    searchUsers: async (query: string, limit: number = 10): Promise<BackendUser[]> => {
        const response = await api.get('/users/search', {
            params: { q: query, limit }
        });
        return response.data;
    }
};

export default api;