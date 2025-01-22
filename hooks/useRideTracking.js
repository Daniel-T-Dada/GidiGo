'use client';

import { useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useStore } from '@/store/useStore';
import { simulateDriverStatusUpdates } from '@/mockData/pusherMock';

export const RIDE_STATUS = {
    PENDING: 'pending',
    DRIVER_ASSIGNED: 'driver_assigned',
    ARRIVING: 'arriving',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

export function useRideTracking(bookingId) {
    const { currentRide, setCurrentRide } = useStore();

    // Subscribe to mock status updates
    useEffect(() => {
        if (!bookingId || !currentRide) return;

        // Only start status updates if a driver has been assigned
        if (currentRide.status !== RIDE_STATUS.DRIVER_ASSIGNED) return;

        console.log('Starting ride status updates...');

        // Start simulating status updates
        const cleanup = simulateDriverStatusUpdates((status) => {
            setCurrentRide(prev => ({
                ...prev,
                status: status
            }));

            // Show toast notifications for important status changes
            if (status === RIDE_STATUS.ARRIVING) {
                toast.success('Your driver is arriving!');
            } else if (status === RIDE_STATUS.IN_PROGRESS) {
                toast.success('Your ride has started!');
            } else if (status === RIDE_STATUS.COMPLETED) {
                toast.success('Ride completed! Thank you for riding with us.');
            }
        });

        return () => {
            console.log('Cleaning up ride status updates...');
            cleanup();
        };
    }, [bookingId, currentRide, setCurrentRide]);

    // Get status information
    const getStatusInfo = useCallback(() => {
        const statusMap = {
            [RIDE_STATUS.DRIVER_ASSIGNED]: {
                title: 'Driver Assigned',
                description: 'Your driver is on the way',
                color: 'blue'
            },
            [RIDE_STATUS.ARRIVING]: {
                title: 'Driver Arriving',
                description: 'Your driver is almost there',
                color: 'yellow'
            },
            [RIDE_STATUS.IN_PROGRESS]: {
                title: 'In Progress',
                description: 'You are on your way to the destination',
                color: 'green'
            },
            [RIDE_STATUS.COMPLETED]: {
                title: 'Completed',
                description: 'You have arrived at your destination',
                color: 'green'
            }
        };

        return statusMap[currentRide?.status] || {
            title: 'Unknown',
            description: 'Updating status...',
            color: 'gray'
        };
    }, [currentRide?.status]);

    // Handle ride cancellation
    const handleCancellation = useCallback(async () => {
        try {
            setCurrentRide(prev => ({
                ...prev,
                status: RIDE_STATUS.CANCELLED
            }));
            toast.success('Ride cancelled successfully');
        } catch (error) {
            console.error('Error cancelling ride:', error);
            toast.error('Failed to cancel ride');
        }
    }, [setCurrentRide]);

    // Emergency contact handler
    const handleEmergency = useCallback(async () => {
        try {
            toast.success('Emergency services have been notified');
        } catch (error) {
            console.error('Error contacting emergency services:', error);
            toast.error('Failed to contact emergency services');
        }
    }, []);

    // Add canCancelRide as a function
    const canCancelRide = useCallback(() => {
        return currentRide?.status === RIDE_STATUS.PENDING ||
            currentRide?.status === RIDE_STATUS.DRIVER_ASSIGNED;
    }, [currentRide?.status]);

    return {
        booking: currentRide,
        isLoading: !currentRide,
        error: null,
        rideStatus: currentRide?.status,
        driverLocation: currentRide?.driverLocation,
        statusInfo: getStatusInfo(),
        handleEmergency,
        handleCancellation,
        canCancelRide
    };
} 