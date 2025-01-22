'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { UsersIcon } from '@heroicons/react/24/outline';

const RidesTab = memo(({ searchQuery }) => {
    const activeRides = [
        {
            id: 1,
            passenger: {
                name: 'John Doe',
                avatar: null
            },
            driver: {
                name: 'Michael Johnson',
                avatar: null
            },
            pickup: 'Ikeja City Mall',
            dropoff: 'Lekki Phase 1',
            status: 'in_progress',
            startTime: '2024-01-22T10:30:00',
            amount: 3500
        }
        // Add more mock rides as needed
    ];

    const filteredRides = activeRides.filter(ride =>
        ride.passenger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.dropoff.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Passenger
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Driver
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Route
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRides.map((ride) => (
                            <motion.tr
                                key={ride.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            {ride.passenger.avatar ? (
                                                <img
                                                    src={ride.passenger.avatar}
                                                    alt={`${ride.passenger.name}'s avatar`}
                                                    className="h-10 w-10 rounded-full"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <UsersIcon className="h-6 w-6 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {ride.passenger.name}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            {ride.driver.avatar ? (
                                                <img
                                                    src={ride.driver.avatar}
                                                    alt={`${ride.driver.name}'s avatar`}
                                                    className="h-10 w-10 rounded-full"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <UsersIcon className="h-6 w-6 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {ride.driver.name}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{ride.pickup}</div>
                                    <div className="text-sm text-gray-500">{ride.dropoff}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ride.status === 'in_progress'
                                        ? 'bg-blue-100 text-blue-800'
                                        : ride.status === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {ride.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ₦{ride.amount.toLocaleString()}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredRides.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No active rides found</p>
                </div>
            )}
        </div>
    );
});

RidesTab.displayName = 'RidesTab';

export default RidesTab; 