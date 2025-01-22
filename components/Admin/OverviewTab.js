'use client';

import { memo, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register ChartJS components
if (typeof window !== 'undefined') {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );
}

// Dynamically import Chart component with no SSR
const Chart = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), {
    ssr: false,
    loading: () => (
        <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
    )
});

const StatCard = memo(({ title, value, change, isPositive }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            <p className={`ml-2 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {change}
            </p>
        </div>
    </div>
));

StatCard.displayName = 'StatCard';

const OverviewTab = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Revenue',
                data: [12000, 19000, 15000, 25000, 22000, 30000],
                borderColor: 'rgb(59, 130, 246)',
                tension: 0.4
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value="1,234"
                    change="+12%"
                    isPositive={true}
                />
                <StatCard
                    title="Active Drivers"
                    value="89"
                    change="+5%"
                    isPositive={true}
                />
                <StatCard
                    title="Completed Rides"
                    value="456"
                    change="+8%"
                    isPositive={true}
                />
                <StatCard
                    title="Revenue"
                    value="₦123,456"
                    change="+15%"
                    isPositive={true}
                />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
                <div className="h-[300px]">
                    {mounted && <Chart data={chartData} options={chartOptions} />}
                </div>
            </div>
        </div>
    );
};

export default memo(OverviewTab); 