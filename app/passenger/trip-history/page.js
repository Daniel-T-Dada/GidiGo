'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import TripHistoryPage from '@/components/TripHistory/TripHistoryPage';

export default function PassengerTripHistoryPage() {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { user } = useStore();

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        if (user.role !== 'passenger') {
            router.push('/driver/dashboard');
            return;
        }
        setIsLoading(false);
    }, [user, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return <TripHistoryPage />;
} 