'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export default function MapComponent({ pickup, dropoff }) {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const markersRef = useRef([]);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);

    useEffect(() => {
        // Initialize Google Maps
        const loader = new Loader({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
            version: 'weekly',
            libraries: ['places']
        });

        loader.load().then(() => {
            const map = new google.maps.Map(mapRef.current, {
                center: { lat: 6.5244, lng: 3.3792 }, // Lagos coordinates
                zoom: 12,
                styles: [
                    {
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [{ visibility: 'off' }]
                    }
                ]
            });

            setMap(map);

            const directionsRenderer = new google.maps.DirectionsRenderer({
                map,
                suppressMarkers: true,
                polylineOptions: {
                    strokeColor: '#4F46E5',
                    strokeWeight: 5
                }
            });

            setDirectionsRenderer(directionsRenderer);
        });
    }, []);

    useEffect(() => {
        if (!map || !pickup?.coordinates || !dropoff?.coordinates) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // Add pickup marker
        const pickupMarker = new google.maps.Marker({
            position: pickup.coordinates,
            map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#22C55E',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2
            },
            title: 'Pickup Location'
        });
        markersRef.current.push(pickupMarker);

        // Add dropoff marker
        const dropoffMarker = new google.maps.Marker({
            position: dropoff.coordinates,
            map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#3B82F6',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2
            },
            title: 'Dropoff Location'
        });
        markersRef.current.push(dropoffMarker);

        // Calculate and display route
        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
            {
                origin: pickup.address,
                destination: dropoff.address,
                travelMode: google.maps.TravelMode.DRIVING
            },
            (result, status) => {
                if (status === 'OK' && directionsRenderer) {
                    directionsRenderer.setDirections(result);

                    // Fit bounds to show both markers
                    const bounds = new google.maps.LatLngBounds();
                    bounds.extend(pickup.coordinates);
                    bounds.extend(dropoff.coordinates);
                    map.fitBounds(bounds);
                }
            }
        );
    }, [map, pickup, dropoff, directionsRenderer]); // Removed markers from dependencies

    return (
        <div ref={mapRef} className="w-full h-full">
            {/* Map will be rendered here */}
        </div>
    );
}