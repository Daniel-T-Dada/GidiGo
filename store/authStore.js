import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';

const formatErrorMessage = (error) => {
    if (!error.response?.data) return 'An error occurred. Please try again.';

    const data = error.response.data;

    // Handle username exists error
    if (data.username?.[0]?.includes('already exists')) {
        return 'An account with this email already exists. Please log in or use a different email.';
    }

    // Handle email exists error
    if (data.email?.[0]?.includes('already exists')) {
        return 'An account with this email already exists. Please log in or use a different email.';
    }

    // Handle phone number exists error
    if (data.phone_number?.[0]?.includes('already exists')) {
        return 'This phone number is already registered. Please use a different number.';
    }

    // Handle invalid credentials
    if (data.detail?.includes('No active account') || data.detail?.includes('Invalid credentials')) {
        return 'Invalid username or password. Please check your credentials and try again.';
    }

    // Handle validation errors
    const validationErrors = [];
    for (const [field, errors] of Object.entries(data)) {
        if (Array.isArray(errors)) {
            const errorMsg = errors[0];
            if (field === 'password') {
                validationErrors.push(errorMsg); // Password errors are usually self-explanatory
            } else {
                validationErrors.push(`${field.replace(/_/g, ' ')}: ${errorMsg}`);
            }
        }
    }

    if (validationErrors.length > 0) {
        return validationErrors.join('\\n');
    }

    // Fallback to any available error message
    return data.error || data.detail || data.message || 'An unexpected error occurred. Please try again.';
};

// Create a single instance of the store
const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            toastIds: new Set(), // Track toast IDs to prevent duplicates

            // Driver state
            currentRide: null,
            driverStatus: 'offline',
            userLocation: null,
            notifications: [],

            // Driver actions
            setCurrentRide: (ride) => set({ currentRide: ride }),
            setDriverStatus: (status) => set({ driverStatus: status }),
            setUserLocation: (location) => set({ userLocation: location }),
            addNotification: (notification) =>
                set((state) => ({
                    notifications: [notification, ...state.notifications]
                })),
            clearNotifications: () => set({ notifications: [] }),

            showToast: (type, message, id) => {
                const toastIds = get().toastIds;
                if (id && toastIds.has(id)) {
                    return; // Skip if this toast was already shown
                }

                if (id) {
                    toastIds.add(id);
                    set({ toastIds: new Set(toastIds) });
                }

                toast[type](message);
            },

            login: async (username, password) => {
                set({ isLoading: true });
                try {
                    console.log('Attempting login for username:', username);

                    const response = await axiosInstance.post('api/auth/login/', {
                        username,
                        password,
                    });

                    console.log('Login response:', response.data);
                    const { access_token, refresh_token, ...userData } = response.data;
                    console.log('User data:', userData);

                    // Store tokens
                    localStorage.setItem('access_token', access_token);
                    localStorage.setItem('refresh_token', refresh_token);

                    // Store user data in cookie for middleware
                    Cookies.set('gidigo_user', JSON.stringify(userData), { path: '/' });

                    // Update store
                    set({
                        user: userData,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    get().showToast('success', 'Login successful!', 'login-success');
                    return { success: true, user: userData };
                } catch (error) {
                    console.error('Login error:', {
                        message: error.message,
                        response: error.response?.data,
                        status: error.response?.status,
                        url: error.config?.url
                    });
                    set({ isLoading: false });
                    const errorMessage = formatErrorMessage(error);
                    get().showToast('error', errorMessage, 'login-error');
                    return { success: false, error: errorMessage };
                }
            },

            register: async (userData) => {
                set({ isLoading: true });
                try {
                    console.log('Starting registration with data:',
                        userData instanceof FormData
                            ? 'FormData object'
                            : { ...userData, password: '[REDACTED]' }
                    );

                    // Register the user
                    const registerResponse = await axiosInstance.post('api/auth/register/', userData);
                    console.log('Registration response:', registerResponse.data);

                    // For FormData, we need to extract username and password differently
                    let loginCredentials;
                    if (userData instanceof FormData) {
                        loginCredentials = {
                            username: userData.get('username'),
                            password: userData.get('password')
                        };
                    } else {
                        loginCredentials = {
                            username: userData.username,
                            password: userData.password
                        };
                    }

                    // Automatically login after successful registration
                    console.log('Attempting automatic login after registration');
                    try {
                        const loginResponse = await axiosInstance.post('api/auth/login/', loginCredentials);
                        console.log('Auto-login response:', loginResponse.data);

                        const { access_token, refresh_token, ...user } = loginResponse.data;

                        // Store tokens
                        localStorage.setItem('access_token', access_token);
                        localStorage.setItem('refresh_token', refresh_token);

                        // Store user data in cookie for middleware
                        Cookies.set('gidigo_user', JSON.stringify(user), { path: '/' });

                        // Update store
                        set({
                            user,
                            isAuthenticated: true,
                            isLoading: false,
                        });

                        get().showToast('success', 'Registration successful!', 'register-success');
                        return { success: true, user };
                    } catch (loginError) {
                        console.error('Auto-login failed:', loginError);
                        // Even if auto-login fails, registration was successful
                        set({ isLoading: false });
                        get().showToast('error', 'Registration successful but auto-login failed. Please log in manually.', 'register-login-error');
                        return {
                            success: true,
                            user: registerResponse.data,
                            loginError: 'Registration successful but auto-login failed. Please log in manually.'
                        };
                    }
                } catch (error) {
                    console.error('Registration error:', {
                        message: error.message,
                        response: error.response?.data,
                        status: error.response?.status
                    });
                    set({ isLoading: false });
                    const errorMessage = formatErrorMessage(error);
                    get().showToast('error', errorMessage, 'register-error');
                    return { success: false, error: errorMessage };
                }
            },

            logout: async () => {
                set({ isLoading: true });
                try {
                    const refreshToken = localStorage.getItem('refresh_token');
                    if (refreshToken) {
                        await axiosInstance.post('api/auth/logout/', {
                            refresh_token: refreshToken
                        });
                    }
                } catch (error) {
                    console.error('Logout error:', error);
                } finally {
                    // Clear tokens and user data
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    Cookies.remove('gidigo_user', { path: '/' });

                    // Reset store state
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        toastIds: new Set(), // Clear toast history
                        currentRide: null,
                        driverStatus: 'offline',
                        userLocation: null,
                        notifications: []
                    });

                    get().showToast('success', 'Logged out successfully', 'logout-success');
                }
            },

            refreshToken: async () => {
                try {
                    const refreshToken = localStorage.getItem('refresh_token');
                    if (!refreshToken) {
                        throw new Error('No refresh token available');
                    }

                    const response = await axiosInstance.post('api/auth/token/refresh/', {
                        refresh: refreshToken
                    });

                    const { access } = response.data;
                    localStorage.setItem('access_token', access);
                    return access;
                } catch (error) {
                    console.error('Token refresh error:', error);
                    // Clear everything on refresh token failure
                    get().logout();
                    throw error;
                }
            },

            updateUser: async (userData) => {
                set({ isLoading: true });
                try {
                    const response = await axiosInstance.patch('api/auth/user/', userData);
                    const updatedUser = response.data;

                    // Update cookie
                    Cookies.set('gidigo_user', JSON.stringify(updatedUser), { path: '/' });

                    set({
                        user: updatedUser,
                        isLoading: false
                    });

                    get().showToast('success', 'Profile updated successfully', 'profile-update-success');
                    return { success: true, user: updatedUser };
                } catch (error) {
                    console.error('Profile update error:', error);
                    set({ isLoading: false });
                    const errorMessage = formatErrorMessage(error);
                    get().showToast('error', errorMessage, 'profile-update-error');
                    return { success: false, error: errorMessage };
                }
            },

            updateProfile: async (profileData) => {
                set({ isLoading: true });
                try {
                    const response = await axiosInstance.patch('api/auth/profile/', profileData);
                    set({
                        user: { ...get().user, ...response.data },
                        isLoading: false,
                    });
                    toast.success('Profile updated successfully');
                    return true;
                } catch (error) {
                    set({ isLoading: false });
                    toast.error(error.response?.data?.error || 'Profile update failed');
                    return false;
                }
            },

            // Session management
            getSessions: async () => {
                try {
                    const response = await axiosInstance.get('api/auth/sessions/');
                    return response.data;
                } catch (error) {
                    toast.error('Failed to fetch sessions');
                    return [];
                }
            },

            terminateSession: async (sessionId) => {
                try {
                    await axiosInstance.delete(`api/auth/sessions/${sessionId}/`);
                    toast.success('Session terminated successfully');
                    return true;
                } catch (error) {
                    toast.error('Failed to terminate session');
                    return false;
                }
            },

            terminateOtherSessions: async () => {
                try {
                    await axiosInstance.delete('api/auth/sessions/');
                    toast.success('All other sessions terminated successfully');
                    return true;
                } catch (error) {
                    toast.error('Failed to terminate other sessions');
                    return false;
                }
            },

            requestPasswordReset: async (email) => {
                set({ isLoading: true });
                try {
                    await axiosInstance.post('api/auth/password/reset/', { email });
                    set({ isLoading: false });
                    toast.success('Password reset email sent. Please check your inbox.');
                    return true;
                } catch (error) {
                    set({ isLoading: false });
                    toast.error(error.response?.data?.error || 'Failed to send reset email');
                    return false;
                }
            },

            resetPassword: async (uidb64, token, password, re_password) => {
                set({ isLoading: true });
                try {
                    await axiosInstance.post(`api/auth/password/reset/confirm/${uidb64}/${token}/`, {
                        password,
                        re_password
                    });
                    set({ isLoading: false });
                    toast.success('Password reset successful. Please login with your new password.');
                    return true;
                } catch (error) {
                    set({ isLoading: false });
                    toast.error(error.response?.data?.error || 'Password reset failed');
                    return false;
                }
            },

            // Initialize user session from stored token
            initializeAuth: async () => {
                const token = localStorage.getItem('access_token');
                if (token) {
                    try {
                        const response = await axiosInstance.get('api/auth/profile/');
                        set({
                            user: response.data,
                            isAuthenticated: true,
                        });
                    } catch (error) {
                        // If token is invalid, clear everything
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        set({
                            user: null,
                            isAuthenticated: false,
                        });
                    }
                }
            },

            // Reset all state
            reset: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    currentRide: null,
                    driverStatus: 'offline',
                    userLocation: null,
                    notifications: [],
                    toastIds: new Set()
                });
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                Cookies.remove('gidigo_user', { path: '/' });
            },
        }),
        {
            name: 'auth-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
);

export default useAuthStore; 