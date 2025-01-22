import Pusher from 'pusher-js';

const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/pusher/auth/`,
    auth: {
        headers: {
            get Authorization() {
                return localStorage.getItem('access_token')
                    ? `Bearer ${localStorage.getItem('access_token')}`
                    : undefined;
            }
        }
    }
});

export default pusherClient;

export function subscribeToPusherChannel(channelName, eventName, callback) {
    const channel = getPusherClient().subscribe(channelName);
    channel.bind(eventName, callback);
    return () => {
        channel.unbind(eventName, callback);
        getPusherClient().unsubscribe(channelName);
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