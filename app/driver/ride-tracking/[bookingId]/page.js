'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PhoneIcon,
    ChatBubbleLeftIcon,
    CheckCircleIcon,
    MapPinIcon,
    XMarkIcon,
    BanknotesIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useStore } from '@/store/useStore';

// Dynamically import MapComponent to prevent hydration issues
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    )
});

const RIDE_STATUS = {
    ACCEPTED: 'ACCEPTED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
};

// Payment Confirmation Modal
const PaymentConfirmationModal = memo(({ fare, onConfirm, onClose }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Confirm Payment</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-lg text-gray-700">Fare Amount</span>
                    <span className="text-2xl font-bold text-gray-900">{fare}</span>
                </div>

                <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                    <BanknotesIcon className="h-6 w-6 text-yellow-600 mr-3" />
                    <p className="text-sm text-yellow-700">
                        Please confirm that you have received the payment from the passenger.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onConfirm}
                        className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Confirm Payment
                    </motion.button>
                </div>
            </div>
        </motion.div>
    </motion.div>
));
PaymentConfirmationModal.displayName = 'PaymentConfirmationModal';

export default function RideTrackingPage() {
    const params = useParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [rideDetails, setRideDetails] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isMapMounted, setIsMapMounted] = useState(false);
    const { currentRide, setCurrentRide } = useStore();

    // Set map mounted state after hydration
    useEffect(() => {
        setIsMapMounted(true);
    }, []);

    useEffect(() => {
        // Simulate fetching ride details
        const fetchRideDetails = async () => {
            try {
                // TODO: Replace with actual API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                setRideDetails({
                    id: params.bookingId,
                    passenger: {
                        name: 'John Doe',
                        phone: '+234 123 456 7890',
                        rating: 4.8
                    },
                    pickup: {
                        address: 'Marina Mall, Lagos',
                        location: { lat: 6.4355, lng: 3.4152 }
                    },
                    dropoff: {
                        address: 'Victoria Island, Lagos',
                        location: { lat: 6.4281, lng: 3.4219 }
                    },
                    status: RIDE_STATUS.ACCEPTED,
                    fare: '₦2,500'
                });
                setCurrentLocation({ lat: 6.4355, lng: 3.4152 }); // Start at pickup location
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching ride details:', error);
                toast.error('Failed to load ride details');
            }
        };

        fetchRideDetails();
    }, [params.bookingId]);

    // Simulate location updates when trip is in progress
    useEffect(() => {
        if (rideDetails?.status !== RIDE_STATUS.IN_PROGRESS || !currentLocation) return;

        const interval = setInterval(() => {
            setCurrentLocation(prev => {
                if (!prev) return rideDetails.pickup.location;

                // Move towards dropoff location
                const targetLat = rideDetails.dropoff.location.lat;
                const targetLng = rideDetails.dropoff.location.lng;
                const step = 0.0001; // Small step for smooth movement

                const newLat = prev.lat + (targetLat > prev.lat ? step : -step);
                const newLng = prev.lng + (targetLng > prev.lng ? step : -step);

                // Check if we've reached the destination
                const isAtDestination =
                    Math.abs(newLat - targetLat) < step &&
                    Math.abs(newLng - targetLng) < step;

                if (isAtDestination) {
                    // Clear the interval immediately
                    clearInterval(interval);

                    // Update ride status to prevent further updates
                    setRideDetails(prevRide => ({
                        ...prevRide,
                        status: 'ARRIVED_AT_DESTINATION'
                    }));

                    // Show completion message and modal only once
                    setTimeout(() => {
                        toast.success("You've reached the destination!");
                        setShowPaymentModal(true);
                    }, 500);

                    // Return exact destination coordinates
                    return rideDetails.dropoff.location;
                }

                return { lat: newLat, lng: newLng };
            });
        }, 1000);

        window.locationUpdateInterval = interval;
        return () => {
            if (window.locationUpdateInterval) {
                clearInterval(window.locationUpdateInterval);
            }
        };
    }, [rideDetails?.status, currentLocation, rideDetails?.dropoff?.location, rideDetails?.pickup?.location]);

    // Update Zustand store when ride details change
    useEffect(() => {
        if (rideDetails) {
            setCurrentRide(rideDetails);
        }
    }, [rideDetails, setCurrentRide]);

    const handleStartTrip = useCallback(async () => {
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500));

            setRideDetails(prev => ({
                ...prev,
                status: RIDE_STATUS.IN_PROGRESS
            }));

            toast.success('Trip started successfully');
        } catch (error) {
            console.error('Error starting trip:', error);
            toast.error('Failed to start trip');
        }
    }, []);

    const handleCancelTrip = useCallback(async () => {
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Clear both local and global states immediately
            setRideDetails(null);
            setCurrentRide(null);
            setCurrentLocation(null);

            // Clear any active intervals or timers
            if (window.locationUpdateInterval) {
                clearInterval(window.locationUpdateInterval);
            }

            toast.success('Trip cancelled successfully');

            // Force immediate state updates before navigation
            await Promise.resolve();

            // Navigate back to dashboard
            router.push('/driver/dashboard');
        } catch (error) {
            console.error('Error cancelling trip:', error);
            toast.error('Failed to cancel trip');
        }
    }, [setCurrentRide, router]);

    // Cleanup effect when navigating away or unmounting
    useEffect(() => {
        return () => {
            // Clear all states on unmount
            setCurrentRide(null);
            if (window.locationUpdateInterval) {
                clearInterval(window.locationUpdateInterval);
            }
        };
    }, [setCurrentRide]);

    // Effect to sync ride status with store
    useEffect(() => {
        if (!rideDetails || rideDetails.status === RIDE_STATUS.CANCELLED) {
            setCurrentRide(null);
        } else {
            setCurrentRide(rideDetails);
        }
    }, [rideDetails, setCurrentRide]);

    const handleCompleteTrip = useCallback(async () => {
        setShowPaymentModal(true);
    }, []);

    const handlePaymentConfirmed = useCallback(async () => {
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500));

            setRideDetails(prev => ({
                ...prev,
                status: RIDE_STATUS.COMPLETED
            }));

            toast.success('Trip completed successfully');
            setShowPaymentModal(false);

            // Redirect to trip history page
            router.push('/driver/trip-history');
        } catch (error) {
            console.error('Error completing trip:', error);
            toast.error('Failed to complete trip');
        }
    }, [router]);

    if (isLoading || !rideDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const isInProgress = rideDetails.status === RIDE_STATUS.IN_PROGRESS;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Back Navigation */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push('/driver/dashboard')}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        <span className="font-medium">Back to Dashboard</span>
                    </motion.button>
                </div>
            </div>

            <div className="lg:grid lg:grid-cols-5 lg:gap-0 lg:min-h-screen">
                {/* Map Section - Takes up more space on larger screens */}
                <div className="h-[50vh] lg:h-screen lg:col-span-3 relative">
                    {isMapMounted && (
                        <MapComponent
                            center={rideDetails.pickup.location}
                            markers={[
                                {
                                    position: rideDetails.pickup.location,
                                    title: 'Pickup',
                                    type: 'pickup'
                                },
                                {
                                    position: rideDetails.dropoff.location,
                                    title: 'Dropoff',
                                    type: 'dropoff'
                                }
                            ]}
                            driverLocation={currentLocation}
                            zoom={14}
                        />
                    )}
                </div>

                {/* Ride Details Section - Fixed sidebar on larger screens */}
                <div className="lg:col-span-2 lg:h-screen lg:overflow-y-auto">
                    <div className="p-4 lg:p-6">
                        <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6 -mt-10 lg:mt-0 relative z-10">
                            {/* Status Badge */}
                            <div className={`
                                inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4
                                ${isInProgress ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                            `}>
                                <span className="mr-1.5">●</span>
                                {isInProgress ? 'In Progress' : 'Accepted'}
                            </div>

                            {/* Passenger Details */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                    <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-xl font-semibold text-gray-600">
                                            {rideDetails.passenger.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{rideDetails.passenger.name}</h3>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span className="text-yellow-500">★</span>
                                            <span className="ml-1">{rideDetails.passenger.rating}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                        onClick={() => window.open(`tel:${rideDetails.passenger.phone}`)}
                                    >
                                        <PhoneIcon className="h-6 w-6" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                    >
                                        <ChatBubbleLeftIcon className="h-6 w-6" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Location Details */}
                            <div className="space-y-6 mb-6">
                                <div className="flex items-start space-x-3">
                                    <div className="mt-1">
                                        <div className="w-3 h-3 bg-blue-600 rounded-full" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 block mb-1">Pickup Location</label>
                                        <p className="text-gray-900 text-lg">{rideDetails.pickup.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="mt-1">
                                        <div className="w-3 h-3 bg-purple-600 rounded-full" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 block mb-1">Dropoff Location</label>
                                        <p className="text-gray-900 text-lg">{rideDetails.dropoff.address}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Fare */}
                            <div className="py-4 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-lg">Fare</span>
                                    <span className="text-2xl font-semibold text-gray-900">{rideDetails.fare}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                {!isInProgress && (
                                    <>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleCancelTrip}
                                            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-base lg:text-lg"
                                        >
                                            Cancel Ride
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleStartTrip}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-base lg:text-lg flex items-center justify-center"
                                        >
                                            <MapPinIcon className="h-5 w-5 mr-2" />
                                            Start Trip
                                        </motion.button>
                                    </>
                                )}
                                {isInProgress && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleCompleteTrip}
                                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-base lg:text-lg col-span-2 flex items-center justify-center"
                                    >
                                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                                        Complete Trip
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Confirmation Modal */}
            <AnimatePresence>
                {showPaymentModal && (
                    <PaymentConfirmationModal
                        fare={rideDetails.fare}
                        onConfirm={handlePaymentConfirmed}
                        onClose={() => setShowPaymentModal(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
} 