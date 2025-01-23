import Pusher from 'pusher-js';

let pusherClient = null;

export function getPusherClient() {
    if (!pusherClient) {
        const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
        const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // Only initialize if we have the required config
        if (key && cluster && apiUrl) {
            try {
                pusherClient = new Pusher(key, {
                    cluster,
                    authEndpoint: `${apiUrl}/api/auth/pusher/auth/`,
                    auth: {
                        headers: {
                            get Authorization() {
                                return localStorage.getItem('access_token')
                                    ? `Bearer ${localStorage.getItem('access_token')}`
                                    : undefined;
                            }
                        }
                    },
                    enabledTransports: ['ws', 'wss'],
                    forceTLS: false,
                    disableStats: true,
                    // Add timeout and activity timeouts
                    activityTimeout: 120000, // 2 minutes
                    pongTimeout: 30000 // 30 seconds
                });
            } catch (error) {
                console.error('Failed to initialize Pusher client:', error);
            }
        } else {
            console.warn('Pusher configuration missing. Real-time updates will be disabled.');
        }
    }
    return pusherClient;
}

export function subscribeToPusherChannel(channelName, eventName, callback) {
    const client = getPusherClient();
    if (!client) return () => { }; // Return no-op cleanup if client isn't available

    const channel = client.subscribe(channelName);
    channel.bind(eventName, callback);

    return () => {
        try {
            channel.unbind(eventName, callback);
            client.unsubscribe(channelName);
        } catch (error) {
            console.error('Error cleaning up Pusher subscription:', error);
        }
    };
}

// Utility function to create unique channel names
export function createRideChannel(rideId) {
    return `ride-${rideId}`;
}

export function createDriverChannel(driverId) {
    return `driver-${driverId}`;
}

export function createUserChannel(userId) {
    return `user-${userId}`;
} 