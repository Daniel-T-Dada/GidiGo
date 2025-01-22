// Mock data for a ride request
export const mockRideRequest = {
    id: 'ride-123',
    pickup: {
        name: 'Ikeja City Mall',
        coordinates: { lat: 6.5244, lng: 3.3792 }
    },
    dropoff: {
        name: 'Lekki Phase 1',
        coordinates: { lat: 6.5355, lng: 3.3087 }
    },
    passenger: {
        id: 'user-123',
        name: 'Toluwani Ogunde',
        phone: '+234 123 456 7890',
        rating: 4.8
    },
    price: 3500,
    distance: '15.2 km',
    duration: '45 mins',
    rideType: 'comfort'
};

// Mock driver data
export const mockDriver = {
    id: 'driver-123',
    name: 'Gloria Ajiboye',
    phone: '+234 098 765 4321',
    rating: 4.9,
    vehicle: {
        model: 'Toyota Camry',
        color: 'Silver',
        plate: 'LAG 123 XY'
    },
    location: { lat: 6.5300, lng: 3.3800 }
};

// Simulate driver movement
export function simulateDriverMovement(from, to, duration = 30000) {
    const steps = 20;
    const interval = duration / steps;
    const latStep = (to.lat - from.lat) / steps;
    const lngStep = (to.lng - from.lng) / steps;

    return Array.from({ length: steps }, (_, i) => ({
        lat: from.lat + (latStep * i),
        lng: from.lng + (lngStep * i),
        delay: interval * i
    }));
}

// Mock function to simulate ride request flow
export async function simulateRideRequestFlow() {
    // Step 1: Create ride request
    const rideRequest = { ...mockRideRequest };

    // Step 2: Simulate driver assignment after 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));
    const driverAssignment = { ...mockDriver };

    // Step 3: Generate movement path
    const movementPath = simulateDriverMovement(
        driverAssignment.location,
        rideRequest.pickup.coordinates
    );

    return {
        rideRequest,
        driverAssignment,
        movementPath
    };
}

// Mock function to simulate driver status updates
export function simulateDriverStatusUpdates(callback) {
    const statuses = ['arriving', 'arrived', 'in_progress', 'completed'];
    let currentIndex = 0;

    const interval = setInterval(() => {
        if (currentIndex < statuses.length) {
            callback(statuses[currentIndex]);
            currentIndex++;
        } else {
            clearInterval(interval);
        }
    }, 5000);

    return () => clearInterval(interval);
} 