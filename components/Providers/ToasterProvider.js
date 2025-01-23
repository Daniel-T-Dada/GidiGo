'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Toaster = dynamic(
    () => import('react-hot-toast').then((mod) => mod.Toaster),
    {
        ssr: false,
        loading: () => null,
    }
);

export default function ToasterProvider() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                className: 'text-sm font-medium',
                style: {
                    borderRadius: '8px',
                    padding: '12px 16px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    color: '#111827',
                    background: '#ffffff',
                },
                success: {
                    style: {
                        background: '#ecfdf5',
                        color: '#065f46',
                        border: '1px solid #34d399',
                    },
                    iconTheme: {
                        primary: '#059669',
                        secondary: '#ffffff',
                    },
                },
                error: {
                    style: {
                        background: '#fef2f2',
                        color: '#991b1b',
                        border: '1px solid #fca5a5',
                    },
                    iconTheme: {
                        primary: '#dc2626',
                        secondary: '#ffffff',
                    },
                },
                loading: {
                    style: {
                        background: '#ffffff',
                        color: '#1f2937',
                        border: '1px solid #e5e7eb',
                    },
                },
            }}
        />
    );
} 