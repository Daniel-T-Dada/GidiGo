import { NextResponse } from 'next/server';

export function middleware(request) {
    // Get user data from cookies instead of localStorage
    const userDataCookie = request.cookies.get('gidigo_user');
    const user = userDataCookie ? JSON.parse(userDataCookie.value) : null;
    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/signup', '/about'];
    if (publicRoutes.includes(pathname)) {
        // Only redirect from login/signup if user is already logged in
        if (user && (pathname === '/login' || pathname === '/signup')) {
            return NextResponse.redirect(new URL(
                user.role === 'driver' ? '/driver/dashboard' : '/passenger/dashboard',
                request.url
            ));
        }
        return NextResponse.next();
    }

    // Check if user is authenticated for protected routes
    if (!user) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Handle role-specific routes
    if (pathname.startsWith('/driver/')) {
        if (user.role !== 'driver') {
            return NextResponse.redirect(new URL('/passenger/dashboard', request.url));
        }
    } else if (pathname.startsWith('/passenger/')) {
        if (user.role === 'driver') {
            return NextResponse.redirect(new URL('/driver/dashboard', request.url));
        }
    } else if (pathname === '/dashboard') {
        // Redirect /dashboard to the role-specific dashboard
        return NextResponse.redirect(new URL(
            user.role === 'driver' ? '/driver/dashboard' : '/passenger/dashboard',
            request.url
        ));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard',
        '/passenger/:path*',
        '/driver/:path*',
        '/login',
        '/signup',
    ],
}; 