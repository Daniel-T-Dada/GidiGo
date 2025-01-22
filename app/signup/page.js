'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, TruckIcon } from '@heroicons/react/24/outline';
import PassengerForm from '@/components/Auth/PassengerForm';
import DriverForm from '@/components/Auth/DriverForm';
import { useSearchParams } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';

function SignupContent() {
    const [selectedRole, setSelectedRole] = useState(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const type = searchParams.get('type');
        if (type === 'driver') {
            setSelectedRole('driver');
        }
    }, [searchParams]);

    const roles = [
        {
            id: 'passenger',
            title: 'Passenger',
            description: 'Sign up to book rides and travel with ease',
            icon: UserIcon,
        },
        {
            id: 'driver',
            title: 'Driver',
            description: 'Join our network of professional drivers',
            icon: TruckIcon,
        },
    ];

    // If accessed via "Become a Driver", show only driver form
    if (searchParams.get('type') === 'driver') {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <DriverForm />
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {!selectedRole ? (
                    <>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Choose how you want to use GidiGo
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                            {roles.map((role) => (
                                <motion.div
                                    key={role.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedRole(role.id)}
                                    className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-blue-400 cursor-pointer"
                                >
                                    <div className="flex-shrink-0">
                                        <span className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <role.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="focus:outline-none">
                                            <p className="text-sm font-medium text-gray-900">{role.title}</p>
                                            <p className="text-sm text-gray-500 truncate">{role.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <button
                            onClick={() => setSelectedRole(null)}
                            className="mb-8 text-sm text-blue-600 hover:text-blue-500 flex items-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Back to role selection
                        </button>
                        {selectedRole === 'passenger' ? <PassengerForm /> : <DriverForm />}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <ErrorBoundary fallback={<div>Something went wrong. Please try again.</div>}>
            <Suspense fallback={<div>Loading...</div>}>
                <SignupContent />
            </Suspense>
        </ErrorBoundary>
    );
} 