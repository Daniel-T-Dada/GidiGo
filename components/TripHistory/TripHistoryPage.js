import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function TripHistoryPage() {
    const [trips, setTrips] = useState([]);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        // Mock data for now
        setTrips([
            { id: 1, date: '2024-03-15', from: 'Home', to: 'Office', status: 'Completed', amount: 2500 },
            { id: 2, date: '2024-03-14', from: 'Office', to: 'Mall', status: 'Completed', amount: 3500 },
        ]);
    }, []);

    const handleBack = () => {
        router.push('/passenger/dashboard');
    };

    if (!isMounted) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={handleBack}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to Dashboard
                </button>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">Trip History</h1>

                <div className="space-y-4">
                    {trips.map((trip) => (
                        <div
                            key={trip.id}
                            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {trip.from} → {trip.to}
                                    </h3>
                                    <p className="text-gray-500">{trip.date}</p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    {trip.status}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900">
                                    ₦{trip.amount.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 