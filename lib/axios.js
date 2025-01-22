import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    // For now, we'll use a mock API URL since backend isn't ready
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage if it exists
        const token = typeof window !== 'undefined' ? localStorage.getItem('gidigo_token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // For now, simulate API responses since backend isn't ready
        if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(config);
                }, 1000);
            });
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Clear token and redirect to login if refresh fails
            localStorage.removeItem('gidigo_token');
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api; 