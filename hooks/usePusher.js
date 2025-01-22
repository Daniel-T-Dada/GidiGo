import { useState, useEffect } from 'react';
import Pusher from 'pusher-js';

// Use test credentials if env vars are not set
const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY || '2122170';
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap1';

export function usePusher() {
    const [pusher, setPusher] = useState(null);

    useEffect(() => {
        if (typeof window === 'undefined') return; // Prevent SSR issues

        let pusherClient;
        try {
            // Initialize Pusher with enhanced configuration
            pusherClient = new Pusher(PUSHER_KEY, {
                cluster: PUSHER_CLUSTER,
                forceTLS: true,
                enabledTransports: ['ws', 'wss'],
                wsHost: `ws-${PUSHER_CLUSTER}.pusher.com`,
                httpHost: `sockjs-${PUSHER_CLUSTER}.pusher.com`,
                disableStats: true,
                enableStats: false,
                timeout: 20000, // Increase timeout to 20 seconds
                activityTimeout: 120000, // Increase activity timeout to 2 minutes
                pongTimeout: 60000, // Increase pong timeout to 1 minute
            });

            // Handle connection success
            pusherClient.connection.bind('connected', () => {
                console.log('Connected to Pusher');
            });

            // Handle connection error
            pusherClient.connection.bind('error', (err) => {
                console.error('Pusher connection error:', err);
                // Attempt to reconnect on error
                if (pusherClient && pusherClient.connection.state === 'disconnected') {
                    pusherClient.connect();
                }
            });

            // Handle disconnection
            pusherClient.connection.bind('disconnected', () => {
                console.log('Disconnected from Pusher');
                // Attempt to reconnect when disconnected
                if (pusherClient) {
                    pusherClient.connect();
                }
            });

            setPusher(pusherClient);
        } catch (error) {
            console.error('Error initializing Pusher:', error);
        }

        // Cleanup on unmount
        return () => {
            if (pusherClient) {
                try {
                    pusherClient.disconnect();
                } catch (error) {
                    console.error('Error disconnecting Pusher:', error);
                }
            }
        };
    }, []);

    return pusher;
} 