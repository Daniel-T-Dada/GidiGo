'use client';

import { motion } from 'framer-motion';
import { MapIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

export default function FeaturesSection() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Why Choose GidiGo?
                        </p>
                    </div>

                    <div className="mt-20">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <StaticFeatureCard
                                icon={<MapIcon className="h-6 w-6 text-white" aria-hidden="true" />}
                                title="Smart Navigation"
                                description="Advanced routing algorithms to find the quickest path to your destination."
                            />
                            <StaticFeatureCard
                                icon={<ShieldCheckIcon className="h-6 w-6 text-white" aria-hidden="true" />}
                                title="Safe & Secure"
                                description="Verified drivers and real-time trip monitoring for your peace of mind."
                            />
                            <StaticFeatureCard
                                icon={<ClockIcon className="h-6 w-6 text-white" aria-hidden="true" />}
                                title="24/7 Availability"
                                description="Rides available round the clock, whenever you need them."
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Why Choose GidiGo?
                    </p>
                </div>

                <div className="mt-20">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <FeatureCard
                            icon={<MapIcon className="h-6 w-6 text-white" aria-hidden="true" />}
                            title="Smart Navigation"
                            description="Advanced routing algorithms to find the quickest path to your destination."
                        />
                        <FeatureCard
                            icon={<ShieldCheckIcon className="h-6 w-6 text-white" aria-hidden="true" />}
                            title="Safe & Secure"
                            description="Verified drivers and real-time trip monitoring for your peace of mind."
                        />
                        <FeatureCard
                            icon={<ClockIcon className="h-6 w-6 text-white" aria-hidden="true" />}
                            title="24/7 Availability"
                            description="Rides available round the clock, whenever you need them."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StaticFeatureCard({ icon, title, description }) {
    return (
        <div className="pt-6">
            <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                    <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                            {icon}
                        </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{title}</h3>
                    <p className="mt-5 text-base text-gray-500">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="pt-6"
        >
            <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                    <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                            {icon}
                        </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{title}</h3>
                    <p className="mt-5 text-base text-gray-500">
                        {description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
} 