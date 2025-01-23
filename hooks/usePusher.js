import { useEffect, useRef } from 'react';
import { getPusherClient } from '@/lib/pusher';
import useAuthStore from '@/store/authStore';

export function usePusher(channelName, eventName, callback) {
    const { isAuthenticated, user } = useAuthStore();
    const channelRef = useRef(null);

    useEffect(() => {
        // Only proceed if we have authentication and a user
        if (!isAuthenticated || !user) {
            console.log('Pusher: No authenticated user, skipping subscription');
            return;
        }

        if (!channelName || !eventName || !callback) {
            console.warn('Pusher: Missing required parameters', { channelName, eventName });
            return;
        }

        let client;
        try {
            client = getPusherClient();
        } catch (error) {
            console.warn('Pusher client initialization failed:', error);
            return;
        }

        // If client initialization failed, exit early
        if (!client) {
            console.warn('Pusher client not available. Real-time updates will be disabled.');
            return;
        }

        // Create channel name with user ID for private channels
        const fullChannelName = channelName.startsWith('private-')
            ? `${channelName}${user.id}`
            : channelName;

        let channel;
        try {
            // Subscribe to channel
            channel = client.subscribe(fullChannelName);
            channelRef.current = channel;

            // Bind to event
            channel.bind(eventName, callback);

            console.log(`Successfully subscribed to channel: ${fullChannelName}`);
        } catch (error) {
            console.error('Error in Pusher subscription:', error);
            // Attempt cleanup if subscription failed
            if (channel) {
                try {
                    client.unsubscribe(fullChannelName);
                } catch (cleanupError) {
                    console.error('Error cleaning up failed subscription:', cleanupError);
                }
            }
            return;
        }

        // Cleanup on unmount or when dependencies change
        return () => {
            if (channelRef.current) {
                try {
                    channelRef.current.unbind(eventName);
                    client.unsubscribe(fullChannelName);
                    console.log(`Successfully unsubscribed from channel: ${fullChannelName}`);
                } catch (error) {
                    console.error('Error cleaning up Pusher subscription:', error);
                }
            }
        };
    }, [isAuthenticated, user, channelName, eventName, callback]);

    return channelRef.current;
}

export function usePrivateChannel(channelName, eventName, callback) {
    return usePusher(`private-${channelName}`, eventName, callback);
}

export default usePusher; 