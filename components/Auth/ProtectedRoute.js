import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuthStore from '@/store/authStore';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const router = useRouter();
    const { isAuthenticated, user, isLoading } = useAuthStore();

    useEffect(() => {
        // Check if authentication is still loading
        if (isLoading) return;

        // If not authenticated, redirect to login
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        // If roles are specified, check if user has required role
        if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
            router.push('/unauthorized');
        }
    }, [isAuthenticated, user, isLoading, router, allowedRoles]);

    // Show nothing while loading or redirecting
    if (isLoading || !isAuthenticated) {
        return null;
    }

    // If roles are specified and user doesn't have required role, show nothing
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return null;
    }

    // If all checks pass, render the protected content
    return children;
} 