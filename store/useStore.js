import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Function to get initial state from cookies
const getInitialState = () => {
    if (typeof document === 'undefined') return null;
    const userCookie = document.cookie.split('; ').find(row => row.startsWith('gidigo_user='));
    return userCookie ? JSON.parse(userCookie.split('=')[1]) : null;
};

export const useStore = create(
    persist(
        (set) => ({
            // Auth state
            user: getInitialState(),
            setUser: (user) => {
                // Update cookie when setting user
                if (typeof document !== 'undefined') {
                    if (user) {
                        document.cookie = `gidigo_user=${JSON.stringify(user)}; path=/`;
                    } else {
                        document.cookie = 'gidigo_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
                    }
                }
                set({ user });
            },
            logout: () => {
                // Clear cookie on logout
                if (typeof document !== 'undefined') {
                    document.cookie = 'gidigo_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
                }
                set({
                    user: null,
                    currentRide: null,
                    driverStatus: 'offline',
                    userLocation: null,
                    notifications: []
                });
            },

            // Ride state
            currentRide: null,
            setCurrentRide: (ride) => set({ currentRide: ride }),

            // Driver state (for driver app)
            driverStatus: 'offline',
            setDriverStatus: (status) => set({ driverStatus: status }),

            // Location state
            userLocation: null,
            setUserLocation: (location) => set({ userLocation: location }),

            // Notifications
            notifications: [],
            addNotification: (notification) =>
                set((state) => ({
                    notifications: [notification, ...state.notifications]
                })),
            clearNotifications: () => set({ notifications: [] }),

            // Clear all state
            reset: () => set({
                user: null,
                currentRide: null,
                driverStatus: 'offline',
                userLocation: null,
                notifications: []
            })
        }),
        {
            name: 'gidigo-storage',
            partialize: (state) => ({
                user: state.user,
                driverStatus: state.driverStatus
            })
        }
    )
) 