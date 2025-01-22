import { useEffect, useRef } from 'react';
import pusherClient from '@/lib/pusher';
import useAuthStore from '@/store/authStore';

export function usePusher(channelName, eventName, callback) {
    const { isAuthenticated, user } = useAuthStore();
    const channelRef = useRef(null);

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        // Create channel name with user ID for private channels
        const fullChannelName = channelName.startsWith('private-')
            ? `${channelName}${user.id}`
            : channelName;

        // Subscribe to channel
        const channel = pusherClient.subscribe(fullChannelName);
        channelRef.current = channel;

        // Bind to event
        channel.bind(eventName, callback);

        // Cleanup on unmount or when dependencies change
        return () => {
            if (channelRef.current) {
                channelRef.current.unbind(eventName);
                pusherClient.unsubscribe(fullChannelName);
            }
        };
    }, [channelName, eventName, callback, isAuthenticated, user]);

    return channelRef.current;
}

export function usePrivateChannel(channelName, eventName, callback) {
    return usePusher(`private-${channelName}`, eventName, callback);
}

export default usePusher; 