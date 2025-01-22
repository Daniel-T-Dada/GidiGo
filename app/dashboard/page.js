'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function DashboardPage() {
    const router = useRouter();
    const { user } = useStore();

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        // Redirect to role-specific dashboard
        if (user.role === 'passenger') {
            router.push('/passenger/dashboard');
        } else if (user.role === 'driver') {
            router.push('/driver/dashboard');
        }
    }, [user, router]);

    // Show loading state while redirecting
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
} 