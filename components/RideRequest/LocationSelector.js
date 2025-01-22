'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/outline';
import { Loader } from '@googlemaps/js-api-loader';

export default function LocationSelector({ onLocationSelect, onConfirm, locations, isDesktop = false }) {
    const [mounted, setMounted] = useState(false);
    const [savedLocations, setSavedLocations] = useState([]);
    const [showSavedLocations, setShowSavedLocations] = useState(false);
    const [activeInput, setActiveInput] = useState(null);
    const [formData, setFormData] = useState({
        pickup: '',
        dropoff: ''
    });
    const pickupAutocomplete = useRef(null);
    const dropoffAutocomplete = useRef(null);

    // Handle mounting state
    useEffect(() => {
        setMounted(true);
    }, []);

    // Update form data when locations change
    useEffect(() => {
        if (mounted) {
            setFormData({
                pickup: locations?.pickup?.name || '',
                dropoff: locations?.dropoff?.name || ''
            });
        }
    }, [locations?.pickup?.name, locations?.dropoff?.name, mounted]);

    useEffect(() => {
        if (!mounted) return;
        // Fetch saved locations (mock data)
        setSavedLocations([
            { id: 1, name: 'Home', address: '123 Example Street, Lekki' },
            { id: 2, name: 'Office', address: '456 Work Avenue, Victoria Island' },
            { id: 3, name: 'Gym', address: '789 Fitness Road, Ikoyi' }
        ]);
    }, [mounted]);

    // Initialize Google Maps Autocomplete
    useEffect(() => {
        if (!mounted) return;

        const loader = new Loader({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
            version: 'weekly',
            libraries: ['places']
        });

        loader.load().then(() => {
            const initAutocomplete = (inputId, ref) => {
                const input = document.getElementById(inputId);
                if (input) {
                    const autocomplete = new window.google.maps.places.Autocomplete(input, {
                        componentRestrictions: { country: 'ng' },
                        fields: ['address_components', 'geometry', 'name', 'formatted_address'],
                    });

                    autocomplete.addListener('place_changed', () => {
                        const place = autocomplete.getPlace();
                        if (!place.geometry) {
                            console.error('No location details available for this place');
                            return;
                        }

                        const location = {
                            name: place.formatted_address,
                            address: place.formatted_address,
                            coordinates: {
                                lat: place.geometry.location.lat(),
                                lng: place.geometry.location.lng()
                            }
                        };

                        const type = inputId === 'pickup' ? 'pickup' : 'dropoff';
                        onLocationSelect(type, location);
                        setFormData(prev => ({ ...prev, [type]: location.name }));
                    });

                    ref.current = autocomplete;
                }
            };

            initAutocomplete('pickup', pickupAutocomplete);
            initAutocomplete('dropoff', dropoffAutocomplete);

            // Add global styles for autocomplete dropdown
            const style = document.createElement('style');
            style.textContent = `
                .pac-container {
                    z-index: 9999 !important;
                    position: fixed !important;
                    background-color: white;
                    margin-top: 5px;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }
            `;
            document.head.appendChild(style);
        });

        return () => {
            if (pickupAutocomplete.current) {
                window.google?.maps?.event?.clearInstanceListeners(pickupAutocomplete.current);
            }
            if (dropoffAutocomplete.current) {
                window.google?.maps?.event?.clearInstanceListeners(dropoffAutocomplete.current);
            }
            const styleElement = document.querySelector('style');
            if (styleElement && styleElement.textContent.includes('pac-container')) {
                styleElement.remove();
            }
        };
    }, [mounted, onLocationSelect]);

    const handleSavedLocationSelect = useCallback((location) => {
        if (activeInput) {
            const locationData = {
                name: location.address,
                address: location.address,
                coordinates: null // You would typically have real coordinates here
            };
            onLocationSelect(activeInput, locationData);
            setFormData(prev => ({ ...prev, [activeInput]: location.address }));
            setShowSavedLocations(false);
            setActiveInput(null);
        }
    }, [activeInput, onLocationSelect]);

    const handleManualInput = useCallback((type, value) => {
        setFormData(prev => ({ ...prev, [type]: value }));
        const location = {
            name: value,
            address: value,
            coordinates: null
        };
        onLocationSelect(type, location);
    }, [onLocationSelect]);

    if (!mounted) {
        return null;
    }

    return (
        <div className={`space-y-6 ${isDesktop ? 'px-0' : 'px-4 pb-6'}`}>
            {/* Pickup Location */}
            <div className="relative">
                <label className="block text-sm font-medium text-secondary mb-1">
                    Pickup Location
                </label>
                <div className="relative">
                    <input
                        id="pickup"
                        type="text"
                        value={formData.pickup}
                        onChange={(e) => handleManualInput('pickup', e.target.value)}
                        onFocus={() => setActiveInput('pickup')}
                        placeholder="Enter pickup location"
                        className="w-full pl-10 pr-3 py-3 
                            bg-background
                            border-2 border-gray-200 
                            rounded-lg 
                            focus:border-primary focus:ring-2 focus:ring-primary/20 
                            text-secondary
                            placeholder-gray-400
                            transition-colors"
                    />
                    <MapPinIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
            </div>

            {/* Dropoff Location */}
            <div className="relative">
                <label className="block text-sm font-medium text-secondary mb-1">
                    Dropoff Location
                </label>
                <div className="relative">
                    <input
                        id="dropoff"
                        type="text"
                        value={formData.dropoff}
                        onChange={(e) => handleManualInput('dropoff', e.target.value)}
                        onFocus={() => setActiveInput('dropoff')}
                        placeholder="Enter dropoff location"
                        className="w-full pl-10 pr-3 py-3 
                            bg-background
                            border-2 border-gray-200 
                            rounded-lg 
                            focus:border-primary focus:ring-2 focus:ring-primary/20 
                            text-secondary
                            placeholder-gray-400
                            transition-colors"
                    />
                    <MapPinIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
            </div>

            {/* Confirm Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-accent transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={!formData.pickup || !formData.dropoff}
            >
                Confirm Locations
            </motion.button>

            {/* Saved Locations Modal */}
            <AnimatePresence>
                {showSavedLocations && mounted && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Saved Locations</h2>
                                <button
                                    onClick={() => setShowSavedLocations(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <span className="sr-only">Close</span>
                                    ×
                                </button>
                            </div>

                            <div className="space-y-2">
                                {savedLocations.map((location) => (
                                    <motion.div
                                        key={location.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handleSavedLocationSelect(location)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <StarIcon className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="font-medium text-gray-900">{location.name}</p>
                                                <p className="text-sm text-gray-500">{location.address}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
} 