'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import dynamic from 'next/dynamic';

// Dynamically import RideTrackingPage to prevent SSR issues
const RideTrackingPage = dynamic(() => import('@/components/RideTracking/RideTrackingPage'), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
    )
});

export default function PassengerRideTrackingPage() {
    const [mounted, setMounted] = useState(false);
    const params = useParams();
    const bookingId = params?.bookingId;
    const { user } = useAuthStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return <RideTrackingPage bookingId={bookingId} />;
} 