'use client';

import { memo, useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneIcon, ChatBubbleLeftIcon, ShieldCheckIcon, MapPinIcon, XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { useRideTracking, RIDE_STATUS } from '@/hooks/useRideTracking';
import { useTripHistory } from '@/hooks/useTripHistory';

// Dynamically import MapComponent with no SSR
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>
    )
});

// Memoized components for better performance
const DriverCard = memo(({ driver, onChat }) => {
    if (!driver) return null;

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">{driver.name}</h2>
                    <p className="text-gray-600">{driver.vehicle?.model} • {driver.vehicle?.color}</p>
                    <p className="text-gray-600">{driver.vehicle?.plate}</p>
                </div>
                <div className="flex space-x-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-gray-100 rounded-full"
                        onClick={onChat}
                    >
                        <ChatBubbleLeftIcon className="h-6 w-6 text-gray-600" />
                    </motion.button>
                    <motion.a
                        href={`tel:${driver.phone}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-primary-100 rounded-full"
                    >
                        <PhoneIcon className="h-6 w-6 text-primary-600" />
                    </motion.a>
                </div>
            </div>
        </div>
    );
});
DriverCard.displayName = 'DriverCard';

const TripProgress = memo(({ pickup, dropoff }) => {
    if (!pickup || !dropoff) return null;

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <div className="space-y-4">
                <div className="flex items-start space-x-3">
                    <div className="mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">Pickup</p>
                        <p className="text-gray-600">{pickup.name || pickup.address || 'Loading...'}</p>
                    </div>
                </div>
                <div className="flex items-start space-x-3">
                    <div className="mt-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">Dropoff</p>
                        <p className="text-gray-600">{dropoff.name || dropoff.address || 'Loading...'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
});
TripProgress.displayName = 'TripProgress';

const RideInfo = memo(({ ride }) => {
    if (!ride) return null;

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-500">Distance</p>
                    <p className="text-lg font-semibold">{ride.distance || '0'} km</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="text-lg font-semibold">{ride.duration || '0'} min</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Fare</p>
                    <p className="text-lg font-semibold">₦{(ride.price || 0).toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">ETA</p>
                    <p className="text-lg font-semibold">{ride.eta || '0'} min</p>
                </div>
            </div>
        </div>
    );
});
RideInfo.displayName = 'RideInfo';

// Receipt Modal Component
const ReceiptModal = memo(({ receipt, onClose }) => (
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
                <h2 className="text-xl font-semibold text-gray-900">Trip Receipt</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between py-2">
                    <span className="text-gray-800 font-medium">Subtotal</span>
                    <span className="font-semibold text-gray-900">₦{receipt.subtotal.toLocaleString()}</span>
                </div>
                {receipt.discount > 0 && (
                    <div className="flex justify-between py-2 text-green-700">
                        <span className="font-medium">Discount</span>
                        <span className="font-semibold">-₦{receipt.discount.toLocaleString()}</span>
                    </div>
                )}
                <div className="flex justify-between py-2 border-t border-gray-200 text-lg">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">₦{receipt.total.toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-700 font-medium">Paid with</p>
                    <p className="text-gray-900 font-medium">{receipt.paymentMethod}</p>
                </div>

                <div className="mt-6">
                    <button
                        onClick={onClose}
                        className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                    >
                        OK
                    </button>
                </div>
            </div>
        </motion.div>
    </motion.div>
));

export default function RideTrackingPage() {
    const { bookingId } = useParams();
    const router = useRouter();
    const {
        booking,
        isLoading,
        error,
        driverLocation,
        statusInfo,
        handleEmergency,
        canCancelRide,
        handleCancellation
    } = useRideTracking(bookingId);
    const { completedTripReceipt, handleReceiptAcknowledged } = useTripHistory();
    const [isMapMounted, setIsMapMounted] = useState(false);

    // Set map mounted state after hydration
    useEffect(() => {
        setIsMapMounted(true);
    }, []);

    const handleChat = useCallback(() => {
        toast.success('Opening chat...');
        // TODO: Implement chat functionality
    }, []);

    const handleCancel = useCallback(async () => {
        const cancelled = await handleCancellation();
        if (cancelled) {
            router.push('/dashboard');
        }
    }, [handleCancellation, router]);

    const handleReceiptClose = useCallback(() => {
        handleReceiptAcknowledged();
    }, [handleReceiptAcknowledged]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Ride Not Found</h1>
                    <p className="text-gray-500 mt-2">{error || 'Unable to find your ride details.'}</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push('/dashboard')}
                        className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg"
                    >
                        Back to Dashboard
                    </motion.button>
                </div>
            </div>
        );
    }

    // Default coordinates for Lagos if pickup/dropoff coordinates are not available
    const defaultLocation = { lat: 6.5244, lng: 3.3792 };

    // Safely access coordinates with fallbacks
    const pickupCoords = booking?.pickup?.coordinates || defaultLocation;
    const dropoffCoords = booking?.dropoff?.coordinates || defaultLocation;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Back Navigation */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push('/dashboard')}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        <span className="font-medium">Back to Dashboard</span>
                    </motion.button>
                </div>
            </div>

            {/* Status Bar */}
            <div className={`bg-${statusInfo.color}-500 text-white sticky top-0 z-50`}>
                <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div>
                        <h1 className="text-lg font-semibold">{statusInfo.title}</h1>
                        <p className="text-sm opacity-90">{statusInfo.description}</p>
                    </div>
                    {canCancelRide() && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCancel}
                            className="p-2 rounded-full hover:bg-white/10"
                        >
                            <XMarkIcon className="h-6 w-6 text-white" />
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Map Section */}
            <div className="h-[40vh] relative">
                {isMapMounted && (
                    <MapComponent
                        pickup={pickupCoords}
                        dropoff={dropoffCoords}
                        driverLocation={driverLocation}
                    />
                )}
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-4 py-6">
                <DriverCard driver={booking?.driver} onChat={handleChat} />
                <RideInfo ride={booking?.ride} />
                {booking?.pickup && booking?.dropoff && (
                    <TripProgress
                        pickup={booking.pickup}
                        dropoff={booking.dropoff}
                    />
                )}

                {/* Emergency Button */}
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleEmergency}
                    className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg flex items-center justify-center space-x-2"
                >
                    <ShieldCheckIcon className="h-6 w-6" />
                    <span>Emergency Help</span>
                </motion.button>
            </div>

            {/* Receipt Modal */}
            <AnimatePresence>
                {completedTripReceipt && (
                    <ReceiptModal
                        receipt={completedTripReceipt}
                        onClose={handleReceiptClose}
                    />
                )}
            </AnimatePresence>
        </div>
    );
} 