'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HeroSection() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
                    <div>
                        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                            <span className="block text-3xl sm:text-4xl md:text-5xl">Move Like a Lagosian</span>
                            <span className="block text-blue-600 text-2xl sm:text-3xl md:text-4xl mt-2">From Gidi to Anywhere</span>
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-sm sm:text-base md:text-lg text-gray-500 md:mt-5 md:max-w-3xl">
                            Born from the heart of Las Gidi, bringing you the speed and energy of Lagos. Fast, reliable rides at your fingertips.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                        <span className="block text-3xl sm:text-4xl md:text-5xl">Move Like a Lagosian</span>
                        <span className="block text-blue-600 text-2xl sm:text-3xl md:text-4xl mt-2">From Gidi to Anywhere</span>
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-sm sm:text-base md:text-lg text-gray-500 md:mt-5 md:max-w-3xl">
                        Born from the heart of Las Gidi, bringing you the speed and energy of Lagos. Fast, reliable rides at your fingertips.
                    </p>
                </motion.div>

                <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="rounded-md shadow"
                    >
                        <Link href="/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                            Get Started
                        </Link>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3"
                    >
                        <Link href="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                            Log In
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
} 