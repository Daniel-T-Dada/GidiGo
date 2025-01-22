'use client';

import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    MapPinIcon,
    ClockIcon,
    CreditCardIcon,
    UserCircleIcon,
    StarIcon,
    ArrowPathIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

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
                    <span className="font-semibold text-gray-900">₦{receipt.amount.toLocaleString()}</span>
                </div>
                {receipt.discount > 0 && (
                    <div className="flex justify-between py-2 text-green-700">
                        <span className="font-medium">Discount</span>
                        <span className="font-semibold">-₦{receipt.discount.toLocaleString()}</span>
                    </div>
                )}
                <div className="flex justify-between py-2 border-t border-gray-200 text-lg">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">₦{receipt.amount.toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-700 font-medium">Trip Details</p>
                    <p className="text-gray-900 font-medium mt-1">{receipt.from} → {receipt.to}</p>
                    <p className="text-sm text-gray-500 mt-1">{receipt.date}</p>
                </div>

                <div className="mt-6">
                    <button
                        onClick={onClose}
                        className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </motion.div>
    </motion.div>
));

ReceiptModal.displayName = 'ReceiptModal';

const PassengerDashboard = () => {
    const [activeTab, setActiveTab] = useState('rides');
    const [isLoading, setIsLoading] = useState(false);
    const [recentTrips, setRecentTrips] = useState([]);
    const [activeTrip, setActiveTrip] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const router = useRouter();

    const tabs = [
        { id: 'rides', label: 'My Rides', icon: MapPinIcon },
        { id: 'payments', label: 'Payments', icon: CreditCardIcon },
        { id: 'favorites', label: 'Saved Places', icon: StarIcon },
        { id: 'profile', label: 'Profile', icon: UserCircleIcon }
    ];

    const mockRides = [
        {
            id: 1,
            pickup: 'Ikeja City Mall',
            dropoff: 'Lekki Phase 1',
            date: '2024-01-22',
            status: 'completed',
            amount: 3500,
            driver: {
                name: 'Michael Johnson',
                rating: 4.8,
                vehicle: 'Toyota Camry (Silver)'
            }
        }
        // Add more mock rides as needed
    ];

    const mockPaymentMethods = [
        {
            id: 1,
            type: 'card',
            last4: '4242',
            expiryMonth: '12',
            expiryYear: '25',
            isDefault: true
        }
        // Add more payment methods as needed
    ];

    const mockSavedPlaces = [
        {
            id: 1,
            name: 'Home',
            address: '123 Example Street, Lekki',
            type: 'home'
        },
        {
            id: 2,
            name: 'Office',
            address: '456 Work Avenue, Victoria Island',
            type: 'work'
        }
        // Add more saved places as needed
    ];

    useEffect(() => {
        setIsMounted(true);
        // TODO: Fetch recent trips and active trip from API
        // Mock data for now
        const mockActiveTrip = {
            id: 3,
            date: new Date().toISOString(),
            from: 'Current Location',
            to: 'Shopping Mall',
            status: 'In Progress',
            amount: 2800,
            bookingId: 'abc123'
        };

        setActiveTrip(null);
        setRecentTrips([
            { id: 1, date: '2024-03-15', from: 'Home', to: 'Office', status: 'Completed', amount: 2500 },
            { id: 2, date: '2024-03-14', from: 'Office', to: 'Mall', status: 'Completed', amount: 3500 },
        ]);
        setIsLoading(false);
    }, []);

    const handleBookRide = () => {
        if (activeTrip) {
            // If there's an active trip, redirect to the tracking page
            router.push(`/passenger/ride-tracking/${activeTrip.bookingId}`);
            return;
        }
        router.push('/passenger/ride-request');
    };

    const handleViewHistory = () => {
        router.push('/passenger/trip-history');
    };

    const handleTripClick = (trip) => {
        if (trip.status === 'In Progress') {
            router.push(`/passenger/ride-tracking/${trip.bookingId}`);
        } else if (trip.status === 'Completed') {
            setSelectedReceipt(trip);
        }
        // Do nothing for cancelled trips
    };

    if (!isMounted) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.reload()}
                        className="p-2 text-gray-500 hover:text-gray-700"
                    >
                        <ArrowPathIcon className="h-5 w-5" />
                    </motion.button>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <motion.div
                        whileHover={activeTrip ? {} : { scale: 1.02 }}
                        whileTap={activeTrip ? {} : { scale: 0.98 }}
                        onClick={handleBookRide}
                        className={`bg-white p-6 rounded-lg shadow-sm transition-all ${activeTrip
                                ? 'cursor-not-allowed opacity-75'
                                : 'cursor-pointer hover:shadow-lg'
                            }`}
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`${activeTrip ? 'bg-gray-100' : 'bg-blue-100'
                                } p-3 rounded-full`}>
                                <MapPinIcon className={`h-6 w-6 ${activeTrip ? 'text-gray-600' : 'text-blue-600'
                                    }`} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {activeTrip ? 'Trip in Progress' : 'Book a Ride'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {activeTrip ? 'Cannot book while on a trip' : 'Find a driver nearby'}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleViewHistory}
                        className="bg-white p-6 rounded-lg shadow-sm cursor-pointer hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="bg-purple-100 p-3 rounded-full">
                                <ClockIcon className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Trip History</h3>
                                <p className="text-sm text-gray-500">View your past rides</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Navigation Tabs */}
                <nav className="flex space-x-4 mb-6 overflow-x-auto pb-2">
                    {tabs.map(({ id, label, icon: Icon }) => {
                        const isActive = activeTab === id;
                        return (
                            <motion.button
                                key={id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveTab(id)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{label}</span>
                            </motion.button>
                        );
                    })}
                </nav>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'rides' && (
                            <div className="space-y-4">
                                {mockRides.map(ride => (
                                    <motion.div
                                        key={ride.id}
                                        layout
                                        className="bg-white rounded-lg shadow-sm p-4"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2">
                                                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {ride.pickup} → {ride.dropoff}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <ClockIcon className="h-5 w-5 text-gray-400" />
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(ride.date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${ride.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {ride.status}
                                            </span>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex items-center">
                                                    <StarIcon className="h-5 w-5 text-yellow-400" />
                                                    <span className="ml-1 text-sm font-medium text-gray-900">
                                                        {ride.driver.rating}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {ride.driver.name} • {ride.driver.vehicle}
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">
                                                ₦{ride.amount.toLocaleString()}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'payments' && (
                            <div className="space-y-4">
                                {mockPaymentMethods.map(method => (
                                    <motion.div
                                        key={method.id}
                                        layout
                                        className="bg-white rounded-lg shadow-sm p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <CreditCardIcon className="h-6 w-6 text-gray-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        •••• {method.last4}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Expires {method.expiryMonth}/{method.expiryYear}
                                                    </p>
                                                </div>
                                            </div>
                                            {method.isDefault && (
                                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'favorites' && (
                            <div className="space-y-4">
                                {mockSavedPlaces.map(place => (
                                    <motion.div
                                        key={place.id}
                                        layout
                                        className="bg-white rounded-lg shadow-sm p-4"
                                    >
                                        <div className="flex items-start space-x-3">
                                            <MapPinIcon className="h-6 w-6 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {place.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {place.address}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                                            <UserCircleIcon className="h-12 w-12 text-gray-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-medium text-gray-900">John Doe</h2>
                                            <p className="text-sm text-gray-500">john@example.com</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                            <p className="mt-1 text-sm text-gray-900">+234 123 456 7890</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Member Since</label>
                                            <p className="mt-1 text-sm text-gray-900">January 2024</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Receipt Modal */}
            <AnimatePresence>
                {selectedReceipt && (
                    <ReceiptModal
                        receipt={selectedReceipt}
                        onClose={() => setSelectedReceipt(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default memo(PassengerDashboard); 