import Link from 'next/link';
import NavbarClient from './NavbarClient';

export default function Navbar() {
    return (
        <nav className="bg-white shadow-sm fixed w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
                <div className="flex justify-between h-16" suppressHydrationWarning>
                    <div className="flex" suppressHydrationWarning>
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-blue-600">GidiGo</span>
                        </Link>
                    </div>
                    <NavbarClient />
                </div>
            </div>
        </nav>
    );
} 