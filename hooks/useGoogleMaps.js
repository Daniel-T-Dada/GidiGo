'use client';

import { useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];

export function useGoogleMaps() {
    const [loadError, setLoadError] = useState(null);

    const { isLoaded, loadError: scriptLoadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    // Update error state if script loading fails
    if (scriptLoadError && !loadError) {
        setLoadError(scriptLoadError);
    }

    return {
        isLoaded: isLoaded && !loadError && !!window.google?.maps,
        loadError: loadError || scriptLoadError
    };
}

export const mapLibraries = libraries; 