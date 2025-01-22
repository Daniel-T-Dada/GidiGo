'use client';

import { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
    CalendarIcon,
    FunnelIcon,
    MapPinIcon,
    StarIcon,
    XMarkIcon,
    DocumentTextIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useTripHistory, TRIP_FILTERS } from '@/hooks/useTripHistory';
import { RIDE_STATUS } from '@/hooks/useRideTracking';

// Memoized components for better performance
const TripCard = memo(({ trip, onViewReceipt }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case RIDE_STATUS.COMPLETED:
                return 'text-green-600 bg-green-50';
            case RIDE_STATUS.CANCELLED:
                return 'text-red-600 bg-red-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-md p-4 mb-4"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm text-gray-700">
                        {format(new Date(trip.date), 'MMM d, yyyy • h:mm a')}
                    </p>
                    <div className="flex items-center mt-1">
                        <span className={`text-sm px-2 py-1 rounded-full font-medium ${getStatusColor(trip.status)}`}>
                            {trip.status}
                        </span>
                        {trip.rating && (
                            <div className="flex items-center ml-2">
                                <StarIcon className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm text-gray-800 ml-1 font-medium">{trip.rating}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                        ₦{trip.ride.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700 font-medium">{trip.ride.type}</p>
                </div>
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex items-start">
                    <div className="mt-1">
                        <div className="w-2.5 h-2.5 bg-primary-600 rounded-full" />
                    </div>
                    <p className="text-sm text-gray-800 ml-3 font-medium">{trip.pickup.name}</p>
                </div>
                <div className="flex items-start">
                    <div className="mt-1">
                        <div className="w-2.5 h-2.5 bg-purple-600 rounded-full" />
                    </div>
                    <p className="text-sm text-gray-800 ml-3 font-medium">{trip.dropoff.name}</p>
                </div>
            </div>

            {trip.driver && (
                <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                    <div>
                        <p className="text-sm font-semibold text-gray-900">{trip.driver.name}</p>
                        <p className="text-sm text-gray-700">
                            {trip.driver.vehicle.model} • {trip.driver.vehicle.plate}
                        </p>
                    </div>
                    {trip.status === RIDE_STATUS.COMPLETED && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onViewReceipt(trip.id)}
                            className="flex items-center text-primary-700 hover:text-primary-800"
                        >
                            <DocumentTextIcon className="h-5 w-5 mr-1" />
                            <span className="text-sm font-semibold">Receipt</span>
                        </motion.button>
                    )}
                </div>
            )}
        </motion.div>
    );
});

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
            </div>
        </motion.div>
    </motion.div>
));

const FilterBar = memo(({ filters, onUpdateFilters }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    return (
        <div className="bg-white border-b sticky top-0 z-40">
            <div className="max-w-3xl mx-auto px-4 py-3">
                <div className="flex items-center space-x-4">
                    <select
                        value={filters.status}
                        onChange={(e) => onUpdateFilters({ status: e.target.value })}
                        className="form-select rounded-lg border-gray-300 text-sm font-medium text-gray-800"
                    >
                        <option value={TRIP_FILTERS.ALL}>All Trips</option>
                        <option value={TRIP_FILTERS.COMPLETED}>Completed</option>
                        <option value={TRIP_FILTERS.CANCELLED}>Cancelled</option>
                    </select>

                    <button
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className="flex items-center text-sm text-gray-700 hover:text-gray-900 font-medium"
                    >
                        <CalendarIcon className="h-5 w-5 mr-1" />
                        Date Range
                    </button>
                </div>

                {showDatePicker && (
                    <div className="mt-3 pb-3 flex items-center space-x-4">
                        <input
                            type="date"
                            value={filters.dateRange.start || ''}
                            onChange={(e) => onUpdateFilters({
                                dateRange: { ...filters.dateRange, start: e.target.value }
                            })}
                            className="form-input rounded-lg border-gray-300 text-sm"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                            type="date"
                            value={filters.dateRange.end || ''}
                            onChange={(e) => onUpdateFilters({
                                dateRange: { ...filters.dateRange, end: e.target.value }
                            })}
                            className="form-input rounded-lg border-gray-300 text-sm"
                        />
                    </div>
                )}
            </div>
        </div>
    );
});

export default function TripHistoryPage() {
    const {
        trips,
        isLoading,
        error,
        filters,
        updateFilters,
        getTripReceipt
    } = useTripHistory();

    const [selectedReceipt, setSelectedReceipt] = useState(null);

    const handleViewReceipt = useCallback(async (tripId) => {
        const receipt = await getTripReceipt(tripId);
        if (receipt) {
            setSelectedReceipt(receipt);
        }
    }, [getTripReceipt]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Error</h1>
                    <p className="text-gray-500 mt-2">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">Trip History</h1>
                </div>
            </div>

            {/* Filters */}
            <FilterBar filters={filters} onUpdateFilters={updateFilters} />

            {/* Trip List */}
            <div className="max-w-3xl mx-auto px-4 py-6">
                <AnimatePresence>
                    {trips.length > 0 ? (
                        trips.map(trip => (
                            <TripCard
                                key={trip.id}
                                trip={trip}
                                onViewReceipt={handleViewReceipt}
                            />
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <p className="text-gray-500">No trips found</p>
                        </motion.div>
                    )}
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
} 