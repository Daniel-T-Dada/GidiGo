'use client';

import { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UsersIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const UsersTab = memo(({ searchQuery, onDeleteUser }) => {
    const [selectedUserType, setSelectedUserType] = useState('all');
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const users = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'passenger',
            status: 'active',
            joinedDate: '2024-01-15'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'driver',
            status: 'active',
            joinedDate: '2024-01-10'
        }
        // Add more mock users as needed
    ];

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeleteConfirm = useCallback(async (userId) => {
        try {
            setIsLoading(true);
            await onDeleteUser(userId);
            setDeleteConfirmId(null);
        } catch (error) {
            console.error('Failed to delete user:', error);
        } finally {
            setIsLoading(false);
        }
    }, [onDeleteUser]);

    return (
        <div className="space-y-4">
            {/* User Type Filter */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <FilterButton
                        label="All Users"
                        isSelected={selectedUserType === 'all'}
                        onClick={() => setSelectedUserType('all')}
                    />
                    <FilterButton
                        label="Passengers"
                        isSelected={selectedUserType === 'passenger'}
                        onClick={() => setSelectedUserType('passenger')}
                    />
                    <FilterButton
                        label="Drivers"
                        isSelected={selectedUserType === 'driver'}
                        onClick={() => setSelectedUserType('driver')}
                    />
                </div>
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500">
                    <span>
                        Showing {filteredUsers.length} {selectedUserType === 'all' ? 'users' : selectedUserType}
                    </span>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <AnimatePresence>
                                {filteredUsers.map((user) => (
                                    <motion.tr
                                        key={user.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <UsersIcon className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'driver' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.joinedDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {deleteConfirmId === user.id ? (
                                                <div className="flex items-center justify-end space-x-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleDeleteConfirm(user.id)}
                                                        disabled={isLoading}
                                                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                    >
                                                        Confirm
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setDeleteConfirmId(null)}
                                                        disabled={isLoading}
                                                        className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                                                    >
                                                        Cancel
                                                    </motion.button>
                                                </div>
                                            ) : (
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => setDeleteConfirmId(user.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <XCircleIcon className="h-5 w-5" />
                                                </motion.button>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Try adjusting your search or filter to find what you're looking for.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
});

const FilterButton = memo(({ label, isSelected, onClick }) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isSelected
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
    >
        {label}
    </motion.button>
));

FilterButton.displayName = 'FilterButton';
UsersTab.displayName = 'UsersTab';

export default UsersTab; 