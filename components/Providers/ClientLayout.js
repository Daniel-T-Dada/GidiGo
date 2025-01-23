'use client';

import { Suspense } from 'react';
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar/Navbar";
import ToasterProvider from './ToasterProvider';
import ToastLoading from './ToastLoading';

export default function ClientLayout({ children }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <Navbar />
            <main className="pt-16">
                {children}
            </main>
            <Suspense fallback={<ToastLoading />}>
                <ToasterProvider />
            </Suspense>
        </ThemeProvider>
    );
} 