import axios from 'axios';
import type { AppUser } from '../types/user';
import { convertToAppUser } from '../types/user'; // Remove 'type' from this import

const backendApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
});

backendApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

backendApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
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
    full_name: string;
    profile_picture: string;
    phone?: string;
    created_at?: string;
    updated_at?: string;
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
    login: async (credentials: LoginCredentials): Promise<AppUser> => {
        const response = await backendApi.post('/auth/login', credentials);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        return convertToAppUser(user);
    },
    
    register: async (data: RegisterData): Promise<AppUser> => {
        const response = await backendApi.post('/auth/register', data);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        return convertToAppUser(user);
    },
    
    logout: () => {
        localStorage.removeItem('token');
    }
};

export const userApi = {
    getCurrentUser: async (): Promise<AppUser> => {
        const response = await backendApi.get('/users/me');
        return convertToAppUser(response.data);
    },
    
    updateProfile: async (data: Partial<AppUser>): Promise<AppUser> => {
        // Convert frontend user format to backend format
        const backendData: any = {};
        if (data.fullName) backendData.full_name = data.fullName;
        if (data.username) backendData.username = data.username;
        if (data.email) backendData.email = data.email;
        if (data.profilePicture) backendData.profile_picture = data.profilePicture;
        if (data.phone) backendData.phone = data.phone;
        
        const response = await backendApi.put('/users/me', backendData);
        return convertToAppUser(response.data);
    },
    
    searchUsers: async (query: string, limit: number = 10): Promise<AppUser[]> => {
        const response = await backendApi.get('/users/search', {
            params: { q: query, limit }
        });
        return response.data.map(convertToAppUser);
    }
};

export default backendApi;