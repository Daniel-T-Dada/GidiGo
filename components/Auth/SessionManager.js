'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useAuthStore from '@/store/authStore';
import { format } from 'date-fns';
import {
    ComputerDesktopIcon,
    DeviceTabletIcon,
    DeviceMobileIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function SessionManager() {
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { getSessions, terminateSession, terminateOtherSessions } = useAuthStore();

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        setIsLoading(true);
        const data = await getSessions();
        setSessions(data);
        setIsLoading(false);
    };

    const handleTerminateSession = async (sessionId) => {
        const success = await terminateSession(sessionId);
        if (success) {
            loadSessions();
        }
    };

    const handleTerminateOtherSessions = async () => {
        const success = await terminateOtherSessions();
        if (success) {
            loadSessions();
        }
    };

    const getDeviceIcon = (deviceType) => {
        switch (deviceType.toLowerCase()) {
            case 'desktop':
                return <ComputerDesktopIcon className="h-6 w-6" />;
            case 'tablet':
                return <DeviceTabletIcon className="h-6 w-6" />;
            case 'mobile':
                return <DeviceMobileIcon className="h-6 w-6" />;
            default:
                return <ComputerDesktopIcon className="h-6 w-6" />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Active Sessions</h3>
                {sessions.length > 1 && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleTerminateOtherSessions}
                        className="text-sm text-red-600 hover:text-red-500"
                    >
                        Sign out other sessions
                    </motion.button>
                )}
            </div>

            <div className="space-y-4">
                {sessions.map((session) => (
                    <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white shadow rounded-lg p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="text-gray-500">
                                    {getDeviceIcon(session.device_type)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {session.browser}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {session.ip_address}
                                        {session.location && ` • ${session.location}`}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Last active: {format(new Date(session.last_activity), 'PPpp')}
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleTerminateSession(session.id)}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </motion.button>
                        </div>
                    </motion.div>
                ))}

                {sessions.length === 0 && (
                    <p className="text-center text-gray-500 text-sm">
                        No active sessions found
                    </p>
                )}
            </div>
        </div>
    );
} 