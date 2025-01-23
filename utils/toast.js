'use client';

import toast from 'react-hot-toast';

// Helper function to check if we're on the client side
const isClient = typeof window !== 'undefined';

export const showToast = {
    success: (message) => {
        if (isClient) {
            toast.success(message, {
                position: 'bottom-right',
                style: {
                    marginBottom: '1rem',
                    marginRight: '1rem',
                }
            });
        }
    },
    error: (message) => {
        if (isClient) {
            toast.error(message, {
                position: 'bottom-right',
                style: {
                    marginBottom: '1rem',
                    marginRight: '1rem',
                }
            });
        }
    },
    loading: (message) => {
        if (isClient) {
            return toast.loading(message, {
                position: 'bottom-right',
                style: {
                    marginBottom: '1rem',
                    marginRight: '1rem',
                }
            });
        }
        return null;
    },
    promise: async (promise, messages) => {
        return toast.promise(
            promise,
            {
                loading: messages.loading || 'Please wait...',
                success: messages.success || 'Success!',
                error: messages.error || 'Something went wrong',
            },
            {
                position: 'bottom-right',
                style: {
                    marginBottom: '1rem',
                    marginRight: '1rem',
                },
                success: {
                    duration: 4000,
                },
                error: {
                    duration: 5000,
                },
            }
        );
    },
    dismiss: (toastId) => {
        if (isClient && toastId) {
            toast.dismiss(toastId);
        }
    },
}; 