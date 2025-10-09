// components/MapTracker.tsx
"use client";
import React, { useState, useMemo, useCallback, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';

// Definisikan tipe untuk lokasi (latitude dan longitude)
interface Location {
  lat: number;
  lng: number;
}

// Properti untuk komponen map
interface MapTrackerProps {
  // Callback untuk mengirim lokasi marker ke parent component (form)
  onLocationChange: (location: Location | null) => void;
  // Lokasi default (misalnya kantor PDAM Surabaya atau lokasi awal yang relevan)
  defaultCenter: Location;
}

// Konfigurasi library yang dimuat (hanya 'places' untuk fungsionalitas pencarian)
const libraries: ("places")[] = ["places"]; 

export default function MapTracker({ onLocationChange, defaultCenter }: MapTrackerProps) {
  // Ganti dengan API Key Anda
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY"; 

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries: libraries,
  });

  // State untuk lokasi marker saat ini
  const [markerPosition, setMarkerPosition] = useState<Location>(defaultCenter);

  // Memoize center untuk mencegah re-render map yang tidak perlu
  const center = useMemo(() => defaultCenter, [defaultCenter]);

  // Ref untuk mengakses instance SearchBox
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  // Fungsi saat marker dipindahkan
  const handleMarkerDragEnd = useCallback((event: google.maps.MapMouseEvent) => {
    const newLocation: Location = {
      lat: event.latLng!.lat(),
      lng: event.latLng!.lng(),
    };
    setMarkerPosition(newLocation);
    onLocationChange(newLocation);
  }, [onLocationChange]);

  // Fungsi saat peta diklik (untuk menempatkan marker baru)
  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    const newLocation: Location = {
      lat: event.latLng!.lat(),
      lng: event.latLng!.lng(),
    };
    setMarkerPosition(newLocation);
    onLocationChange(newLocation);
  }, [onLocationChange]);

  // Fungsi saat item dari pencarian dipilih
  const handlePlacesChanged = () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        const newLocation: Location = {
          lat: place.geometry!.location!.lat(),
          lng: place.geometry!.location!.lng(),
        };
        setMarkerPosition(newLocation);
        onLocationChange(newLocation);
        // Optional: Pindahkan peta ke lokasi baru
        // Anda mungkin perlu ref ke instance GoogleMap untuk ini
      }
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="w-full">
      <div className="relative mb-2">
        {/* Input Pencarian Lokasi */}
        <StandaloneSearchBox
          onLoad={(ref) => searchBoxRef.current = ref}
          onPlacesChanged={handlePlacesChanged}
        >
            <input
                type="text"
                placeholder="Cari lokasi..."
                className="w-full p-2 border border-gray-300 rounded shadow-sm"
                // Mengganti input 'Cari lokasi...' yang ada pada form
            />
        </StandaloneSearchBox>
      </div>

      <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-300">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={12} // Level zoom default
          onClick={handleMapClick}
        >
          {/* Marker Lokasi */}
          <Marker
            position={markerPosition}
            draggable={true} // Memungkinkan marker dipindahkan
            onDragEnd={handleMarkerDragEnd}
          />
        </GoogleMap>
      </div>
    </div>
  );
}