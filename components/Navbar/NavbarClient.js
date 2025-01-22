'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { showToast } from '@/utils/toast';

export default function NavbarClient() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const { user, logout } = useStore();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        if (isOpen) {
            const handleClick = (e) => {
                if (!e.target.closest('.mobile-menu')) {
                    setIsOpen(false);
                }
            };
            document.addEventListener('click', handleClick);
            return () => document.removeEventListener('click', handleClick);
        }
    }, [isOpen]);

    const handleLogout = () => {
        const loadingToast = showToast.loading('Logging out...');
        try {
            logout();
            showToast.dismiss(loadingToast);
            showToast.success('Logged out successfully');
            router.push('/');
            setIsOpen(false);
        } catch (error) {
            showToast.dismiss(loadingToast);
            showToast.error('Failed to logout. Please try again.');
        }
    };

    if (!isMounted) {
        return null;
    }

    return (
        <>
            {/* Desktop menu */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
                <Link
                    href="/about"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    About
                </Link>
                {user ? (
                    <>
                        <Link
                            href="/settings"
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                        >
                            <Cog6ToothIcon className="h-5 w-5 mr-1" />
                            Settings
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Dashboard
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            href="/signup?type=driver"
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Become a Driver
                        </Link>
                        <Link
                            href="/login"
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Log In
                        </Link>
                        <Link
                            href="/signup"
                            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                    className="mobile-menu inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
                    aria-expanded={isOpen}
                >
                    <span className="sr-only">Open main menu</span>
                    {isOpen ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                </button>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="mobile-menu absolute top-full left-0 w-full sm:hidden bg-white shadow-lg"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-4 pt-2 pb-3 space-y-2 divide-y divide-gray-100">
                            <div className="py-2">
                                <Link
                                    href="/about"
                                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    About
                                </Link>
                                {user ? (
                                    <>
                                        <Link
                                            href="/settings"
                                            className="px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Cog6ToothIcon className="h-5 w-5 mr-2" />
                                            Settings
                                        </Link>
                                        <Link
                                            href="/dashboard"
                                            className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center"
                                        >
                                            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/signup?type=driver"
                                            className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Become a Driver
                                        </Link>
                                        <Link
                                            href="/login"
                                            className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Log In
                                        </Link>
                                        <Link
                                            href="/signup"
                                            className="block px-4 py-3 text-base font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
} 