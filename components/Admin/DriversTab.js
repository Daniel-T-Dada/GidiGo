'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, UserIcon } from '@heroicons/react/24/outline';

const DriversTab = memo(({ searchQuery, onApprove, onReject }) => {
    const pendingDrivers = [
        {
            id: 1,
            name: 'Michael Johnson',
            email: 'michael@example.com',
            phone: '+234 123 456 7890',
            vehicle: {
                make: 'Toyota',
                model: 'Camry',
                year: '2020',
                color: 'Silver',
                plateNumber: 'LAG-123-XY'
            },
            documents: {
                license: true,
                insurance: true,
                registration: true
            },
            appliedDate: '2024-01-20'
        }
        // Add more mock pending drivers as needed
    ];

    const filteredDrivers = pendingDrivers.filter(driver =>
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {filteredDrivers.map((driver) => (
                <motion.div
                    key={driver.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-lg shadow-sm p-6"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                    <UserIcon className="h-6 w-6 text-gray-400" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">{driver.name}</h3>
                                <div className="mt-1 text-sm text-gray-500">
                                    <p>{driver.email}</p>
                                    <p>{driver.phone}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onReject(driver.id)}
                                className="text-red-600 hover:text-red-900"
                            >
                                <XCircleIcon className="h-6 w-6" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onApprove(driver.id)}
                                className="text-green-600 hover:text-green-900"
                            >
                                <CheckCircleIcon className="h-6 w-6" />
                            </motion.button>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-gray-200 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Vehicle Information</h4>
                                <div className="mt-2 text-sm text-gray-900">
                                    <p>{driver.vehicle.make} {driver.vehicle.model} ({driver.vehicle.year})</p>
                                    <p>Color: {driver.vehicle.color}</p>
                                    <p>Plate Number: {driver.vehicle.plateNumber}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Documents Verification</h4>
                                <div className="mt-2 space-y-2">
                                    <div className="flex items-center">
                                        <CheckCircleIcon className={`h-5 w-5 ${driver.documents.license ? 'text-green-500' : 'text-gray-300'}`} />
                                        <span className="ml-2 text-sm text-gray-900">Driver's License</span>
                                    </div>
                                    <div className="flex items-center">
                                        <CheckCircleIcon className={`h-5 w-5 ${driver.documents.insurance ? 'text-green-500' : 'text-gray-300'}`} />
                                        <span className="ml-2 text-sm text-gray-900">Insurance</span>
                                    </div>
                                    <div className="flex items-center">
                                        <CheckCircleIcon className={`h-5 w-5 ${driver.documents.registration ? 'text-green-500' : 'text-gray-300'}`} />
                                        <span className="ml-2 text-sm text-gray-900">Vehicle Registration</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-500">
                        Applied on {new Date(driver.appliedDate).toLocaleDateString()}
                    </div>
                </motion.div>
            ))}

            {filteredDrivers.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No pending driver applications</p>
                </div>
            )}
        </div>
    );
});

DriversTab.displayName = 'DriversTab';

export default DriversTab; 