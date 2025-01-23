'use client';

import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
    CurrencyDollarIcon,
    ClockIcon,
    MapPinIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '@/store/authStore';
import { subscribeToPusherChannel, createDriverChannel } from '@/lib/pusher';
import { RIDE_STATUS } from '@/hooks/useRideTracking';
import { usePusher } from '@/hooks/usePusher';

export default function DriverDashboard() {
    const router = useRouter();
    const {
        user,
        driverStatus,
        setDriverStatus,
        currentRide,
        setCurrentRide,
        addNotification
    } = useAuthStore();
    const [isMounted, setIsMounted] = useState(false);
    const [activeRequests, setActiveRequests] = useState([]);
    const [earnings, setEarnings] = useState({
        today: 15000,
        week: 85000,
        month: 350000
    });
    const [stats, setStats] = useState({
        completedRides: 8,
        rating: 4.8,
        acceptanceRate: 95
    });
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);
    const [activeTrip, setActiveTrip] = useState(null);
    const pusher = usePusher();

    useEffect(() => {
        setIsMounted(true);
        // Fetch initial data
        fetchDriverStats();
        fetchActiveTrip();
    }, []);

    const fetchDriverStats = async () => {
        try {
            // TODO: Replace with actual API call
            // For now using mock data
            await new Promise(resolve => setTimeout(resolve, 500));
            // Stats are set in the initial state above
        } catch (error) {
            console.error('Error fetching driver stats:', error);
            toast.error('Failed to load driver statistics');
        }
    };

    const fetchActiveTrip = async () => {
        try {
            // TODO: Replace with actual API call
            // For now using mock data from currentRide if exists
            if (currentRide && currentRide.status !== RIDE_STATUS.COMPLETED) {
                setActiveTrip(currentRide);
            }
        } catch (error) {
            console.error('Error fetching active trip:', error);
        }
    };

    // Update active trip when currentRide changes
    useEffect(() => {
        if (currentRide) {
            if (currentRide.status === RIDE_STATUS.COMPLETED) {
                setActiveTrip(null);
            } else {
                setActiveTrip(currentRide);
            }
        }
    }, [currentRide]);

    // Handle incoming ride requests
    const handleRideRequest = useCallback((data) => {
        setActiveRequests(prev => [...prev, data]);
        addNotification({
            id: Date.now(),
            type: 'ride_request',
            title: 'New Ride Request',
            message: `Pickup from ${data.pickup.name}`,
            data: data
        });
        // Play sound notification
        new Audio('/sounds/notification.mp3').play().catch(() => { });
    }, [addNotification]);

    // Subscribe to Pusher channel when driver goes online
    useEffect(() => {
        if (!driverStatus || driverStatus !== 'ONLINE' || !pusher) return;

        console.log('Subscribing to driver-requests channel...');

        try {
            // Subscribe to the driver requests channel
            const channel = pusher.subscribe('driver-requests');

            // Listen for new ride requests
            channel.bind('client-new-ride-request', (data) => {
                console.log('Received new ride request:', data);
                // Remove any simulated requests first
                setActiveRequests(prev => prev.filter(req => req.id !== 'request-1'));
                handleRideRequest(data);
            });

            // Handle subscription success
            channel.bind('pusher:subscription_succeeded', () => {
                console.log('Successfully subscribed to driver-requests channel');
                // Clear any simulated requests when we successfully connect
                setActiveRequests([]);
            });

            // Handle subscription error
            channel.bind('pusher:subscription_error', (error) => {
                console.error('Error subscribing to driver-requests channel:', error);
                toast.error('Failed to connect to ride request service');
            });

            // Cleanup on unmount or when going offline
            return () => {
                console.log('Unsubscribing from driver-requests channel...');
                if (pusher) {
                    channel.unbind_all();
                    pusher.unsubscribe('driver-requests');
                }
            };
        } catch (error) {
            console.error('Error in Pusher setup:', error);
            toast.error('Failed to initialize ride request service');
        }
    }, [driverStatus, pusher, handleRideRequest]);

    const toggleStatus = useCallback(async () => {
        if (isTogglingStatus) return;
        if (activeTrip) {
            toast.error('Cannot go offline while having an active trip');
            return;
        }

        setIsTogglingStatus(true);
        try {
            const newStatus = driverStatus === 'ONLINE' ? 'OFFLINE' : 'ONLINE';

            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500));

            setDriverStatus(newStatus);

            if (newStatus === 'ONLINE') {
                toast.success('You are now online and can receive ride requests');
            } else {
                toast.success('You are now offline');
                // Clear active requests when going offline
                setActiveRequests([]);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        } finally {
            setIsTogglingStatus(false);
        }
    }, [driverStatus, setDriverStatus, activeTrip, isTogglingStatus]);

    // Accept ride request
    const acceptRide = useCallback(async (rideData) => {
        try {
            setActiveRequests(prev => prev.filter(req => req.id !== rideData.id));

            // Since we're using mock data for now, simulate a successful response
            const acceptedRide = {
                id: rideData.id,
                status: RIDE_STATUS.ACCEPTED,
                pickup: rideData.pickup,
                dropoff: rideData.dropoff,
                passenger: rideData.passenger,
                fare: rideData.estimatedFare,
                distance: rideData.distance,
                duration: rideData.duration
            };

            setCurrentRide(acceptedRide);
            setActiveTrip(acceptedRide);
            router.push(`/driver/ride-tracking/${acceptedRide.id}`);
            toast.success('Ride accepted successfully');
        } catch (error) {
            console.error('Error accepting ride:', error);
            toast.error('Failed to accept ride');
            setActiveRequests(prev => [...prev, rideData]);
        }
    }, [setCurrentRide, router]);

    // Decline ride request
    const declineRide = useCallback(async (rideData) => {
        try {
            setActiveRequests(prev => prev.filter(req => req.id !== rideData.id));

            // Update backend
            await fetch(`/api/rides/${rideData.id}/decline`, {
                method: 'POST'
            });

            toast.success('Ride declined');
        } catch (error) {
            console.error('Error declining ride:', error);
            toast.error('Failed to decline ride');
        }
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Manage your rides and track your earnings
                    </p>
                </div>

                {/* Online/Offline Toggle */}
                <div className="mb-8">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={toggleStatus}
                        disabled={isTogglingStatus || activeTrip}
                        className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium text-white shadow-lg
                            ${driverStatus === 'ONLINE'
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-red-500 hover:bg-red-600'
                            } 
                            ${(isTogglingStatus || activeTrip) ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'} 
                            transition-all duration-200`}
                    >
                        {isTogglingStatus ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center">
                                {driverStatus === 'ONLINE' ? 'Go Offline' : 'Go Online'}
                            </span>
                        )}
                    </motion.button>
                </div>

                {/* Active Trip Card */}
                {activeTrip && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-8"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Trip</h2>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            onClick={() => router.push(`/driver/ride-tracking/${activeTrip.id}`)}
                            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 cursor-pointer"
                        >
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-gray-900">Current Trip</h3>
                                    <span className="text-sm font-medium text-blue-600">
                                        {activeTrip.duration}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        </div>
                                        <p className="ml-2 text-sm text-gray-600">
                                            From: {activeTrip.pickup.name}
                                        </p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        </div>
                                        <p className="ml-2 text-sm text-gray-600">
                                            To: {activeTrip.dropoff.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-blue-600">
                                            ₦{activeTrip.fare}
                                        </span>
                                        <span className="text-gray-500">
                                            {activeTrip.distance}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center text-blue-600">
                                <span className="text-sm font-medium">Click to view trip details</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Active Ride Requests */}
                <AnimatePresence>
                    {activeRequests.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-8"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Requests</h2>
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {activeRequests.map((request) => (
                                    <motion.div
                                        key={request.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                                    >
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-semibold text-gray-900">New Ride Request</h3>
                                                <span className="text-sm font-medium text-blue-600">
                                                    {request.duration}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                    </div>
                                                    <p className="ml-2 text-sm text-gray-600">
                                                        From: {request.pickup.name}
                                                    </p>
                                                </div>
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                    </div>
                                                    <p className="ml-2 text-sm text-gray-600">
                                                        To: {request.dropoff.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="font-medium text-gray-500">
                                                        ₦{request.estimatedFare}
                                                    </span>
                                                    <span className="text-gray-500">
                                                        {request.distance}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-3">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => acceptRide(request)}
                                                className="flex-1 bg-blue-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-md"
                                            >
                                                Accept
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => declineRide(request)}
                                                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                            >
                                                Decline
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Today's Earnings */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100"
                    >
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Today&apos;s Earnings
                                        </dt>
                                        <dd className="text-lg font-semibold text-gray-900">
                                            ₦{earnings.today.toLocaleString()}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-3">
                            <div className="text-sm ">
                                <div className="flex justify-between text-gray-600">
                                    <span>This Week</span>
                                    <span className="font-medium">₦{earnings.week.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 mt-4">
                                    <span>This Month</span>
                                    <span className="font-medium">₦{earnings.month.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Completed Rides */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100"
                    >
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <UserGroupIcon className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Completed Rides
                                        </dt>
                                        <dd className="text-lg font-semibold text-gray-900">
                                            {stats.completedRides}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-3">
                            <div className="text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Acceptance Rate</span>
                                    <span className="font-medium">{stats.acceptanceRate}%</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Average Rating */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100"
                    >
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="p-3 bg-yellow-100 rounded-lg">
                                        <ChartBarIcon className="h-6 w-6 text-yellow-600" />
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Average Rating
                                        </dt>
                                        <dd className="text-lg font-semibold text-gray-900">
                                            {stats.rating}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-3">
                            <div className="flex items-center justify-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className={`h-5 w-5 ${star <= Math.floor(stats.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
} 