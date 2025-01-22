'use client';

import { useState, useEffect } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import toast from 'react-hot-toast';

const mapContainerStyle = {
    width: '100%',
    height: '400px',
};

const defaultMapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    mapId: 'ba5a242e83269c',
    // Styles are managed in Google Cloud Console when using mapId
};

export default function MapComponent({ pickup, dropoff, driverLocation, markers, center, zoom = 14 }) {
    const [map, setMap] = useState(null);
    const [mapMarkers, setMapMarkers] = useState([]);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [driverMarker, setDriverMarker] = useState(null);
    const [isMapLoading, setIsMapLoading] = useState(true);

    const { isLoaded, loadError } = useGoogleMaps();

    // Cleanup function for markers and directions
    const cleanupMap = () => {
        mapMarkers.forEach(marker => {
            if (marker) marker.setMap(null);
        });
        setMapMarkers([]);

        if (directionsRenderer) {
            directionsRenderer.setMap(null);
            setDirectionsRenderer(null);
        }

        if (driverMarker) {
            driverMarker.setMap(null);
            setDriverMarker(null);
        }
    };

    // Update driver location
    useEffect(() => {
        if (!map || !driverLocation || !window.google) return;

        if (driverMarker) {
            driverMarker.setPosition(driverLocation);
        } else {
            const newDriverMarker = new window.google.maps.Marker({
                position: driverLocation,
                map: map,
                title: 'Driver Location',
                icon: {
                    path: 'M23.5 7c.276 0 .5.224.5.5v.511c0 .793-.926.989-1.616.989l-1.086-2h2.202zm-1.441 3.506c.639 1.186.946 2.252.946 3.666 0 1.37-.397 2.533-1.005 3.981v1.847c0 .552-.448 1-1 1h-1.5c-.552 0-1-.448-1-1v-1h-13v1c0 .552-.448 1-1 1h-1.5c-.552 0-1-.448-1-1v-1.847c-.608-1.448-1.005-2.611-1.005-3.981 0-1.414.307-2.48.946-3.666.829-1.537 1.851-3.453 2.93-5.252.828-1.382 1.262-1.707 2.278-1.889 1.532-.275 2.918-.365 4.851-.365s3.319.09 4.851.365c1.016.182 1.45.507 2.278 1.889 1.079 1.799 2.101 3.715 2.93 5.252zm-16.059 2.994c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zm10 1c0-.276-.224-.5-.5-.5h-7c-.276 0-.5.224-.5.5s.224.5.5.5h7c.276 0 .5-.224.5-.5zm2.941-5.527s-.74-1.826-1.631-3.142c-.202-.298-.515-.502-.869-.566-1.511-.272-2.835-.359-4.441-.359s-2.93.087-4.441.359c-.354.064-.667.268-.869.566-.891 1.315-1.631 3.142-1.631 3.142 1.64.313 4.309.497 6.941.497s5.301-.184 6.941-.497zm2.059 4.527c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zm-18.298-6.5h-2.202c-.276 0-.5.224-.5.5v.511c0 .793.926.989 1.616.989l1.086-2z',
                    fillColor: '#4F46E5',
                    fillOpacity: 1,
                    strokeWeight: 1,
                    strokeColor: '#ffffff',
                    scale: 1,
                    anchor: new window.google.maps.Point(12, 12),
                    rotation: 0
                }
            });
            setDriverMarker(newDriverMarker);
        }
    }, [map, driverLocation]);

    useEffect(() => {
        if (!isLoaded || !map || !window.google) return;

        const updateMap = async () => {
            try {
                setIsMapLoading(true);
                // Clean up previous markers and directions
                cleanupMap();

                const bounds = new window.google.maps.LatLngBounds();
                const newMarkers = [];

                // Handle markers prop if provided
                if (markers && markers.length > 0) {
                    markers.forEach(marker => {
                        const { position, title, type } = marker;
                        const markerIcon = {
                            path: window.google.maps.SymbolPath.CIRCLE,
                            fillColor: type === 'pickup' ? '#4F46E5' : '#7C3AED',
                            fillOpacity: 1,
                            strokeWeight: 0,
                            scale: 12
                        };

                        const newMarker = new window.google.maps.Marker({
                            position,
                            map,
                            title,
                            label: {
                                text: type === 'pickup' ? 'P' : 'D',
                                color: 'white'
                            },
                            icon: markerIcon
                        });

                        newMarkers.push(newMarker);
                        bounds.extend(position);
                    });
                } else {
                    // Add pickup marker if location exists
                    if (pickup) {
                        const pickupMarker = new window.google.maps.Marker({
                            position: pickup,
                            map: map,
                            title: 'Pickup Location',
                            label: {
                                text: 'P',
                                color: 'white'
                            },
                            icon: {
                                path: window.google.maps.SymbolPath.CIRCLE,
                                fillColor: '#4F46E5',
                                fillOpacity: 1,
                                strokeWeight: 0,
                                scale: 12
                            }
                        });
                        newMarkers.push(pickupMarker);
                        bounds.extend(pickup);
                    }

                    // Add dropoff marker if location exists
                    if (dropoff) {
                        const dropoffMarker = new window.google.maps.Marker({
                            position: dropoff,
                            map: map,
                            title: 'Dropoff Location',
                            label: {
                                text: 'D',
                                color: 'white'
                            },
                            icon: {
                                path: window.google.maps.SymbolPath.CIRCLE,
                                fillColor: '#7C3AED',
                                fillOpacity: 1,
                                strokeWeight: 0,
                                scale: 12
                            }
                        });
                        newMarkers.push(dropoffMarker);
                        bounds.extend(dropoff);
                    }
                }

                // Add driver location to bounds if available
                if (driverLocation) {
                    bounds.extend(driverLocation);
                }

                setMapMarkers(newMarkers);

                // Fit bounds with padding if we have markers
                if (newMarkers.length > 0 || driverLocation) {
                    map.fitBounds(bounds, {
                        padding: {
                            top: 50,
                            right: 50,
                            bottom: 50,
                            left: 50
                        }
                    });
                } else if (center) {
                    // Use provided center and zoom if available
                    map.setCenter(center);
                    map.setZoom(zoom);
                } else {
                    // Default center if no markers or center provided
                    map.setCenter({ lat: 6.5244, lng: 3.3792 }); // Lagos
                    map.setZoom(12);
                }

                // Try to get directions if both points are set
                if (pickup && dropoff) {
                    try {
                        const directionsService = new window.google.maps.DirectionsService();
                        const result = await directionsService.route({
                            origin: pickup,
                            destination: dropoff,
                            travelMode: window.google.maps.TravelMode.DRIVING,
                            region: 'NG',
                            provideRouteAlternatives: true,
                        });

                        const newDirectionsRenderer = new window.google.maps.DirectionsRenderer({
                            map,
                            suppressMarkers: true,
                            polylineOptions: {
                                strokeColor: '#4F46E5',
                                strokeWeight: 4,
                            },
                        });

                        newDirectionsRenderer.setDirections(result);
                        setDirectionsRenderer(newDirectionsRenderer);
                    } catch (error) {
                        console.error('Error getting directions:', error);
                        toast.error('Unable to get directions. Please try again.');
                    }
                }
            } catch (error) {
                console.error('Error updating map:', error);
            } finally {
                setIsMapLoading(false);
            }
        };

        updateMap();
    }, [isLoaded, map, pickup, dropoff, markers, center, zoom]);

    const onLoad = (map) => {
        setMap(map);
    };

    if (!isLoaded) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <p className="text-red-500">Error loading map</p>
            </div>
        );
    }

    return (
        <>
            {isMapLoading && (
                <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            )}
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                options={defaultMapOptions}
                onLoad={onLoad}
            />
        </>
    );
} 