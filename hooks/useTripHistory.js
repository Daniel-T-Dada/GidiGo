'use client';

import { useState, useCallback, useEffect } from 'react';
import { RIDE_STATUS } from './useRideTracking';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export const TRIP_FILTERS = {
    ALL: 'all',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

export function useTripHistory() {
    const [trips, setTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: TRIP_FILTERS.ALL,
        dateRange: {
            start: null,
            end: null
        }
    });
    const [completedTripReceipt, setCompletedTripReceipt] = useState(null);
    const router = useRouter();

    // Fetch trips with filters
    const fetchTrips = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock data
            const mockTrips = [
                {
                    id: '1',
                    date: '2024-02-20T10:30:00',
                    status: RIDE_STATUS.COMPLETED,
                    pickup: {
                        name: 'Ikeja City Mall',
                        coordinates: { lat: 6.5244, lng: 3.3792 }
                    },
                    dropoff: {
                        name: 'Lekki Phase 1',
                        coordinates: { lat: 6.5355, lng: 3.3087 }
                    },
                    driver: {
                        name: 'John Doe',
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
                        distance: '15.2',
                        duration: '45'
                    },
                    rating: 5,
                    receipt: {
                        subtotal: 3500,
                        discount: 0,
                        total: 3500,
                        paymentMethod: 'Card •••• 4242'
                    }
                },
                {
                    id: '2',
                    date: '2024-02-19T15:45:00',
                    status: RIDE_STATUS.CANCELLED,
                    pickup: {
                        name: 'Victoria Island',
                        coordinates: { lat: 6.4281, lng: 3.4219 }
                    },
                    dropoff: {
                        name: 'Ajah',
                        coordinates: { lat: 6.4698, lng: 3.5852 }
                    },
                    ride: {
                        type: 'Economy',
                        price: 2500,
                        distance: '20.5',
                        duration: '60'
                    }
                },
                // Add more mock trips...
            ];

            setTrips(mockTrips);
        } catch (error) {
            console.error('Error fetching trips:', error);
            setError('Failed to load trip history');
            toast.error('Failed to load trip history');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initialize trips
    useEffect(() => {
        fetchTrips();
    }, [fetchTrips]);

    // Listen for trip completion events
    useEffect(() => {
        // This would typically be a WebSocket or Server-Sent Events connection
        const handleTripCompletion = async (tripId) => {
            try {
                // Fetch the completed trip's receipt
                const receipt = await getTripReceipt(tripId);
                if (receipt) {
                    setCompletedTripReceipt(receipt);
                }
            } catch (error) {
                console.error('Error handling trip completion:', error);
                toast.error('Failed to load trip receipt');
            }
        };

        // Mock event listener setup
        const cleanup = () => {
            // Cleanup WebSocket/SSE connection
        };

        return cleanup;
    }, []);

    // Filter trips based on current filters
    const filteredTrips = useCallback(() => {
        return trips.filter(trip => {
            // Status filter
            if (filters.status !== TRIP_FILTERS.ALL &&
                trip.status !== (filters.status === TRIP_FILTERS.COMPLETED ? RIDE_STATUS.COMPLETED : RIDE_STATUS.CANCELLED)) {
                return false;
            }

            // Date range filter
            if (filters.dateRange.start || filters.dateRange.end) {
                const tripDate = new Date(trip.date);
                if (filters.dateRange.start && tripDate < new Date(filters.dateRange.start)) {
                    return false;
                }
                if (filters.dateRange.end && tripDate > new Date(filters.dateRange.end)) {
                    return false;
                }
            }

            return true;
        });
    }, [trips, filters]);

    // Update filters
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters
        }));
    }, []);

    // Get trip receipt
    const getTripReceipt = useCallback(async (tripId) => {
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500));

            const trip = trips.find(t => t.id === tripId);
            if (!trip) {
                throw new Error('Trip not found');
            }

            return trip.receipt;
        } catch (error) {
            console.error('Error fetching receipt:', error);
            toast.error('Failed to load receipt');
            return null;
        }
    }, [trips]);

    // Handle completed trip receipt acknowledgment
    const handleReceiptAcknowledged = useCallback(() => {
        setCompletedTripReceipt(null);
        router.push('/trip-history');
    }, [router]);

    return {
        trips: filteredTrips(),
        isLoading,
        error,
        filters,
        updateFilters,
        getTripReceipt,
        refreshTrips: fetchTrips,
        completedTripReceipt,
        handleReceiptAcknowledged
    };
} 