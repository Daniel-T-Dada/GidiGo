'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
    UsersIcon,
    UserPlusIcon,
    TruckIcon,
    ChartBarIcon,
    MagnifyingGlassIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Loading skeleton for tabs
const TabSkeleton = () => (
    <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
        </div>
        <div className="h-64 bg-gray-200 rounded"></div>
    </div>
);

// Lazy load tab components
const OverviewTab = dynamic(() => import('@/components/Admin/OverviewTab'), {
    loading: () => <TabSkeleton />
});
const UsersTab = dynamic(() => import('@/components/Admin/UsersTab'), {
    loading: () => <TabSkeleton />
});
const DriversTab = dynamic(() => import('@/components/Admin/DriversTab'), {
    loading: () => <TabSkeleton />
});
const RidesTab = dynamic(() => import('@/components/Admin/RidesTab'), {
    loading: () => <TabSkeleton />
});

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: ChartBarIcon },
        { id: 'users', label: 'Users', icon: UsersIcon },
        { id: 'drivers', label: 'Driver Approvals', icon: UserPlusIcon },
        { id: 'rides', label: 'Active Rides', icon: TruckIcon }
    ];

    useEffect(() => {
        // Simulate initial data loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleDeleteUser = useCallback(async (userId) => {
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('User deleted successfully');
        } catch (error) {
            toast.error('Failed to delete user');
        }
    }, []);

    const handleApproveDriver = useCallback(async (driverId) => {
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Driver approved successfully');
        } catch (error) {
            toast.error('Failed to approve driver');
        }
    }, []);

    const handleRejectDriver = useCallback(async (driverId) => {
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Driver rejected successfully');
        } catch (error) {
            toast.error('Failed to reject driver');
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-6">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:space-x-4">
                        <div className="relative flex-1 sm:flex-none">
                            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-auto pl-10 pr-4 py-2 text-sm border-2 bg-white border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.reload()}
                            className="p-2 text-gray-500 hover:text-gray-700 self-end sm:self-auto"
                        >
                            <ArrowPathIcon className="h-5 w-5" />
                        </motion.button>
                    </div>
                </div>

                {/* Navigation Tabs - Mobile Scrollable */}
                <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6 overflow-x-auto">
                    <nav className="flex border-b border-gray-200 min-w-max">
                        {tabs.map(({ id, label, icon: Icon }) => {
                            const isActive = activeTab === id;
                            return (
                                <motion.button
                                    key={id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setActiveTab(id)}
                                    className={`relative flex items-center space-x-2 py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base font-medium transition-colors ${isActive
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeAdminTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab Content with Suspense */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Suspense fallback={<TabSkeleton />}>
                            {isLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                                </div>
                            ) : (
                                <>
                                    {activeTab === 'overview' && <OverviewTab />}
                                    {activeTab === 'users' && (
                                        <UsersTab
                                            searchQuery={searchQuery}
                                            onDeleteUser={handleDeleteUser}
                                        />
                                    )}
                                    {activeTab === 'drivers' && (
                                        <DriversTab
                                            searchQuery={searchQuery}
                                            onApprove={handleApproveDriver}
                                            onReject={handleRejectDriver}
                                        />
                                    )}
                                    {activeTab === 'rides' && (
                                        <RidesTab
                                            searchQuery={searchQuery}
                                        />
                                    )}
                                </>
                            )}
                        </Suspense>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminDashboard;