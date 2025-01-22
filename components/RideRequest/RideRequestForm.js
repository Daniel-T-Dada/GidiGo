'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeftIcon,
    ArrowPathIcon,
    CreditCardIcon,
    BanknotesIcon,
    UserIcon,
    HomeIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { showToast } from '@/utils/toast';

export default function RideRequestForm({ locations, onBack, isDesktop = false }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [rideDetails, setRideDetails] = useState({
        distance: '15.2 km',
        duration: '45 mins',
        fare: '₦3,500'
    });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Show loading toast
            const loadingToast = showToast.loading('Finding a driver...');

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Generate a mock booking ID
            const bookingId = 'BOOK' + Math.random().toString(36).substr(2, 9).toUpperCase();

            // Dismiss loading toast and show success
            showToast.dismiss(loadingToast);
            showToast.success('Ride request sent successfully!');

            // Navigate to confirmation page
            router.push(`/passenger/booking-confirmation/${bookingId}`);
        } catch (error) {
            showToast.error('Failed to process your request. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const handleBackToDashboard = useCallback(() => {
        router.push('/passenger/dashboard');
    }, [router]);

    return (
        <div className={`space-y-6 ${isDesktop ? 'px-0' : 'px-4 pb-6'}`}>
            {/* Navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
                    </motion.button>
                    <h2 className="text-xl font-semibold text-gray-900">Confirm Ride</h2>
                </div>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleBackToDashboard}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <HomeIcon className="h-5 w-5 text-gray-500" />
                </motion.button>
            </div>

            {/* Ride Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Distance</span>
                    <span className="font-medium">{rideDetails.distance}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="font-medium">{rideDetails.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Estimated Fare</span>
                    <span className="font-medium text-lg">{rideDetails.fare}</span>
                </div>
            </div>

            {/* Location Details */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Pickup</label>
                    <div className="text-gray-900">{locations?.pickup?.address || locations?.pickup?.name}</div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Dropoff</label>
                    <div className="text-gray-900">{locations?.dropoff?.address || locations?.dropoff?.name}</div>
                </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-600">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPaymentMethod('card')}
                        className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors ${paymentMethod === 'card'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <CreditCardIcon className="h-5 w-5" />
                        <span>Card</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPaymentMethod('cash')}
                        className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors ${paymentMethod === 'cash'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <BanknotesIcon className="h-5 w-5" />
                        <span>Cash</span>
                    </motion.button>
                </div>
            </div>

            {/* Note for Driver */}
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Note for Driver (Optional)</label>
                <textarea
                    placeholder="Any special instructions..."
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors resize-none"
                    rows={3}
                />
            </div>

            {/* Request Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full py-4 px-4 rounded-lg text-white font-semibold text-base
                    ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                    transition-colors
                `}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                        <ArrowPathIcon className="h-5 w-5 animate-spin" />
                        <span>Processing...</span>
                    </div>
                ) : (
                    'Request Ride'
                )}
            </motion.button>
        </div>
    );
}