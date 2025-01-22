import toast from 'react-hot-toast';

export const showToast = {
    success: (message) => {
        toast.success(message, {
            id: `success-${Date.now()}`,
        });
    },
    error: (message) => {
        toast.error(message, {
            id: `error-${Date.now()}`,
            duration: 5000,
        });
    },
    loading: (message) => {
        return toast.loading(message, {
            id: `loading-${Date.now()}`,
        });
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
        toast.dismiss(toastId);
    },
}; 