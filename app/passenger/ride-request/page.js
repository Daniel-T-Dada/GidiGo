'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPinIcon,
    ArrowPathIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import RideRequestForm from '@/components/RideRequest/RideRequestForm';
import LocationSelector from '@/components/RideRequest/LocationSelector';

// Dynamically import the map component to prevent SSR issues
const MapComponent = dynamic(
    () => import('@/components/RideRequest/MapComponent'),
    { ssr: false }
);

export default function RideRequestPage() {
    const [mounted, setMounted] = useState(false);
    const [step, setStep] = useState('location-select'); // location-select, confirm-ride
    const [locations, setLocations] = useState({
        pickup: null,
        dropoff: null
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLocationSelect = useCallback((type, location) => {
        setError('');
        setLocations(prev => ({
            ...prev,
            [type]: location
        }));
    }, []);

    const handleConfirmLocations = useCallback(() => {
        if (!locations.pickup || !locations.dropoff) {
            setError('Please select both pickup and dropoff locations');
            return;
        }
        setError('');
        setStep('confirm-ride');
    }, [locations]);

    const handleBack = useCallback(() => {
        setStep('location-select');
        setError('');
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="relative h-screen flex">
                    <div className="hidden md:block w-full md:w-[400px] lg:w-[450px] xl:w-[500px] h-screen bg-white shadow-xl z-10 overflow-y-auto">
                        <div className="p-6 lg:p-8">
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">
                                Request a Ride
                            </h1>
                        </div>
                    </div>
                    <div className="flex-1 relative" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="relative h-screen flex">
                {/* Side Panel for larger screens */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="hidden md:block w-full md:w-[400px] lg:w-[450px] xl:w-[500px] h-screen bg-white shadow-xl z-10 overflow-y-auto"
                >
                    <div className="p-6 lg:p-8">
                        <motion.h1
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8"
                        >
                            Request a Ride
                        </motion.h1>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-4 flex items-center space-x-2 text-red-600 text-sm"
                                >
                                    <ExclamationCircleIcon className="h-5 w-5" />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            {step === 'location-select' ? (
                                <motion.div
                                    key="location-select"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <LocationSelector
                                        onLocationSelect={handleLocationSelect}
                                        onConfirm={handleConfirmLocations}
                                        locations={locations}
                                        isDesktop={true}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="confirm-ride"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <RideRequestForm
                                        locations={locations}
                                        onBack={handleBack}
                                        isDesktop={true}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Map Section */}
                <div className="flex-1 relative">
                    <MapComponent
                        pickup={locations.pickup}
                        dropoff={locations.dropoff}
                    />

                    {/* Floating back button for tablet/desktop when in ride selection */}
                    <AnimatePresence>
                        {step === 'confirm-ride' && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={handleBack}
                                className="md:block hidden absolute top-4 left-4 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom Sheet for mobile screens */}
                <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    className="md:hidden fixed bottom-0 left-0 right-0 
                        bg-background rounded-t-3xl shadow-2xl 
                        transform transition-transform duration-300 ease-in-out 
                        max-h-[85vh] overflow-y-auto
                        z-[100]"
                    style={{
                        willChange: 'transform',
                    }}
                >
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3" />
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mx-4 mb-4 flex items-center space-x-2 text-red-600 text-sm"
                            >
                                <ExclamationCircleIcon className="h-5 w-5" />
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        {step === 'location-select' ? (
                            <motion.div
                                key="location-select-mobile"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="relative"
                                style={{
                                    isolation: 'isolate'
                                }}
                            >
                                <LocationSelector
                                    onLocationSelect={handleLocationSelect}
                                    onConfirm={handleConfirmLocations}
                                    locations={locations}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="confirm-ride-mobile"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="relative"
                            >
                                <RideRequestForm
                                    locations={locations}
                                    onBack={handleBack}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}