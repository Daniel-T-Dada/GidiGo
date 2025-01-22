'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { MapPinIcon, PhoneIcon, StarIcon, HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import MapComponent from '@/components/MapComponent';
import toast from 'react-hot-toast';

export default function BookingConfirmationPage() {
    const { bookingId } = useParams();
    const router = useRouter();
    const [booking, setBooking] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mapKey, setMapKey] = useState(0); // Add key for map remounting

    useEffect(() => {
        // Show success toast on mount
        const showSuccessToast = () => {
            toast.success('Booking confirmed successfully!', {
                position: window.innerWidth >= 768 ? 'bottom-right' : 'top-center',
                duration: 4000,
            });
        };

        // TODO: Fetch booking details from API
        const fetchBookingDetails = async () => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock data
                setBooking({
                    id: bookingId,
                    status: 'confirmed',
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
                        }
                    },
                    ride: {
                        type: 'Comfort',
                        price: 3500,
                        eta: '10'
                    }
                });
                showSuccessToast();
            } catch (error) {
                // console.error('Error fetching booking:', error);
                toast.error('Failed to load booking details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookingDetails();

        // Remount map after a short delay to ensure proper initialization
        const timer = setTimeout(() => {
            setMapKey(prev => prev + 1);
        }, 100);

        return () => clearTimeout(timer);
    }, [bookingId]);

    // Navigation handlers
    const handleBack = () => router.back();
    const handleGoHome = () => router.push('/');

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Booking Not Found</h1>
                    <p className="text-gray-500 mt-2">The booking you&apos;re looking for doesn&apos;t exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
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
                {/* Status Banner */}
                {/* <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                    <h1 className="text-2xl font-semibold text-green-800">Booking Confirmed!</h1>
                    <p className="text-green-600 mt-1">Your ride has been booked successfully.</p>
                </div> */}

                {/* Map Section */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                    <div className="h-[300px] relative">
                        <MapComponent
                            key={mapKey}
                            pickup={booking.pickup.coordinates}
                            dropoff={booking.dropoff.coordinates}
                        />
                    </div>
                </div>

                {/* Driver Details */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Driver Details</h2>
                    <div className="flex items-start space-x-4">
                        <div className="flex-1">
                            <div className="flex items-center">
                                <h3 className="text-lg font-medium text-gray-900">{booking.driver.name}</h3>
                                <div className="flex items-center ml-2">
                                    <StarIcon className="h-5 w-5 text-yellow-400" />
                                    <span className="text-sm text-gray-600 ml-1">{booking.driver.rating}</span>
                                </div>
                            </div>
                            <p className="text-gray-600 mt-1">{booking.driver.vehicle.model} • {booking.driver.vehicle.color}</p>
                            <p className="text-gray-600">{booking.driver.vehicle.plate}</p>
                        </div>
                        <motion.a
                            href={`tel:${booking.driver.phone}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full"
                        >
                            <PhoneIcon className="h-6 w-6 text-primary-600" />
                        </motion.a>
                    </div>
                </div>

                {/* Trip Details */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Trip Details</h2>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="mt-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Pickup</p>
                                <p className="text-gray-600">{booking.pickup.name}</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="mt-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Dropoff</p>
                                <p className="text-gray-600">{booking.dropoff.name}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Estimated Time</p>
                                <p className="text-gray-600">{booking.ride.eta} mins</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">Total Fare</p>
                                <p className="text-lg font-semibold text-gray-900">₦{booking.ride.price.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Track Ride Button */}
                    <div className="mt-8">
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => router.push(`/ride-tracking/${bookingId}`)}
                            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            Track Your Ride
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
} 