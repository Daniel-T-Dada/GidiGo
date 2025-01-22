'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    PhoneIcon,
    ChatBubbleLeftIcon,
    MapPinIcon,
    ArrowLeftIcon,
    HomeIcon
} from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { showToast } from '@/utils/toast';
import { usePusher } from '@/hooks/usePusher';

// Dynamically import MapComponent to prevent SSR issues
const MapComponent = dynamic(() => import('@/components/RideRequest/MapComponent'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    )
});

export default function RideTrackingPage({ bookingId }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [rideDetails, setRideDetails] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);
    const pusher = usePusher();
    const { setActiveRide, clearActiveRide } = useStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !bookingId) return;

        const fetchRideDetails = async () => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock data
                const mockRideDetails = {
                    id: bookingId,
                    status: 'IN_PROGRESS',
                    pickup: {
                        name: 'Current Location',
                        coordinates: { lat: 6.5244, lng: 3.3792 }
                    },
                    dropoff: {
                        name: 'Destination',
                        coordinates: { lat: 6.5355, lng: 3.3087 }
                    },
                    driver: {
                        name: 'John Doe',
                        phone: '+234 123 456 7890',
                        rating: 4.8,
                        vehicle: {
                            model: 'Toyota Camry',
                            color: 'Silver',
                            plate: 'LAG 123 XY'
                        },
                        location: { lat: 6.5300, lng: 3.3800 }
                    },
                    ride: {
                        type: 'Comfort',
                        price: 3500,
                        eta: '10'
                    }
                };

                setRideDetails(mockRideDetails);
                setDriverLocation(mockRideDetails.driver.location);
                setActiveRide(mockRideDetails);

                // Only subscribe to Pusher if it's available
                if (pusher && mounted) {
                    try {
                        const channel = pusher.subscribe(`ride-${bookingId}`);

                        channel.bind('driver-location-update', data => {
                            if (mounted) {
                                setDriverLocation(data.location);
                            }
                        });

                        channel.bind('ride-completed', () => {
                            if (mounted) {
                                showToast.success('Ride completed!');
                                clearActiveRide();
                                router.push('/passenger/dashboard');
                            }
                        });

                        channel.bind('ride-cancelled', () => {
                            if (mounted) {
                                showToast.error('Ride was cancelled');
                                clearActiveRide();
                                router.push('/passenger/dashboard');
                            }
                        });
                    } catch (error) {
                        console.error('Pusher subscription error:', error);
                    }
                }
            } catch (error) {
                if (mounted) {
                    showToast.error('Failed to load ride details');
                }
            }
        };

        fetchRideDetails();

        return () => {
            if (pusher && mounted) {
                try {
                    pusher.unsubscribe(`ride-${bookingId}`);
                } catch (error) {
                    console.error('Pusher unsubscribe error:', error);
                }
            }
        };
    }, [mounted, bookingId, pusher, router, setActiveRide, clearActiveRide]);

    const handleBack = useCallback(() => router.back(), [router]);
    const handleGoHome = useCallback(() => router.push('/passenger/dashboard'), [router]);

    if (!mounted) {
        return null; // Return null on server-side to prevent hydration mismatch
    }

    if (!rideDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
            </div>
        );
    }

    return (
        <div suppressHydrationWarning className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <div className="bg-white shadow-sm">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleBack}
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Back
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleGoHome}
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <HomeIcon className="h-5 w-5 mr-2" />
                        Home
                    </motion.button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Map Section */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                    <div className="h-[400px] relative">
                        {mounted && (
                            <MapComponent
                                pickup={rideDetails.pickup.coordinates}
                                dropoff={rideDetails.dropoff.coordinates}
                                driverLocation={driverLocation}
                            />
                        )}
                    </div>
                </div>

                {/* Driver Details */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Driver Details</h2>
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">{rideDetails.driver.name}</h3>
                            <p className="text-gray-600 mt-1">
                                {rideDetails.driver.vehicle.model} • {rideDetails.driver.vehicle.color}
                            </p>
                            <p className="text-gray-600">{rideDetails.driver.vehicle.plate}</p>
                        </div>
                        <div className="flex space-x-2">
                            <motion.a
                                href={`tel:${rideDetails.driver.phone}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full"
                            >
                                <PhoneIcon className="h-6 w-6 text-blue-600" />
                            </motion.a>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full"
                            >
                                <ChatBubbleLeftIcon className="h-6 w-6 text-green-600" />
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Trip Progress */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="mt-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Pickup</p>
                                <p className="text-gray-600">{rideDetails.pickup.name}</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="mt-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Dropoff</p>
                                <p className="text-gray-600">{rideDetails.dropoff.name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Estimated Time</p>
                                <p className="text-gray-600">{rideDetails.ride.eta} mins</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">Total Fare</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    ₦{rideDetails.ride.price.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 