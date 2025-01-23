import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url);

        // Check if the request data is FormData
        if (config.data instanceof FormData) {
            // Remove Content-Type header to let the browser set it with boundary
            delete config.headers['Content-Type'];
        }

        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Added auth token to request');
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for handling token refresh
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Received successful response from:', response.config.url);
        return response;
    },
    async (error) => {
        console.error('Response interceptor error:', {
            message: error.message,
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
            method: error.config?.method
        });

        const originalRequest = error.config;

        // If the error status is 401 and there's a refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log('Attempting token refresh...');
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    const response = await axios.post(`${baseURL}/api/auth/token/refresh/`, {
                        refresh: refreshToken
                    });

                    const { access } = response.data;
                    localStorage.setItem('access_token', access);
                    console.log('Token refresh successful');

                    // Retry the original request with new token
                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    // If refresh token is invalid, logout user
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }

        // Enhance error object with more details
        const enhancedError = {
            ...error,
            message: error.response?.data?.detail || error.response?.data?.message || error.message,
            status: error.response?.status,
            data: error.response?.data
        };

        return Promise.reject(enhancedError);
    }
);

export default axiosInstance; 