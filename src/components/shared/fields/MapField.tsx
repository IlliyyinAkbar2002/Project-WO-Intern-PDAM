"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
  Circle,
} from "react-leaflet";
import L, { LatLngExpression, LatLngTuple, Marker as LeafletMarker } from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

const baseContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "8px",
} as const;

const defaultCenter: LatLngTuple = [-7.265437, 112.754072];

interface MapFieldProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialPosition?: LatLngTuple;
  showSearch?: boolean;
  radius?: number;
  height?: number;
}

function MapClickHandler({
  setMarkerPosition,
  onLocationSelect,
  setMapCenter,
}: {
  setMarkerPosition: (pos: LatLngExpression) => void;
  onLocationSelect: (lat: number, lng: number) => void;
  setMapCenter: (pos: LatLngExpression) => void;
}) {
  useMapEvents({
    click(e) {
      const lat = parseFloat(e.latlng.lat.toFixed(6));
      const lng = parseFloat(e.latlng.lng.toFixed(6));
      const newPos: LatLngExpression = [lat, lng];

      setMarkerPosition(newPos);
      setMapCenter(newPos);
      onLocationSelect(lat, lng);
    },
  });
  return null;
}

function ChangeMapView({ center }: { center: LatLngExpression }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
}

export default function MapField({
  onLocationSelect,
  initialPosition = defaultCenter,
  showSearch = false,
  radius = 0,
  height,
}: MapFieldProps) {
  const [markerPosition, setMarkerPosition] =
    useState<LatLngExpression>(initialPosition);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(initialPosition);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const markerRef = useRef<LeafletMarker | null>(null);

  // ✅ FIX: Hindari infinite loop
  useEffect(() => {
    const pos = L.latLng(initialPosition);
    const nextLat = pos.lat;
    const nextLng = pos.lng;

    setMarkerPosition((prev) => {
      const prevArr = Array.isArray(prev) ? prev : [0, 0];
      if (prevArr[0] === nextLat && prevArr[1] === nextLng) {
        return prev;
      }
      return [nextLat, nextLng];
    });

    setMapCenter((prev) => {
      const prevArr = Array.isArray(prev) ? prev : [0, 0];
      if (prevArr[0] === nextLat && prevArr[1] === nextLng) {
        return prev;
      }
      return [nextLat, nextLng];
    });

    // ⚠️ OPTIONAL: boleh dihapus kalau tidak ingin trigger parent saat initial load
    onLocationSelect?.(nextLat, nextLng);
  }, [initialPosition, onLocationSelect]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchTerm,
        )}&limit=1`,
      );

      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat).toFixed(6);
        const lng = parseFloat(data[0].lon).toFixed(6);

        const newLat = parseFloat(lat);
        const newLng = parseFloat(lng);
        const newPos: LatLngExpression = [newLat, newLng];

        setMapCenter(newPos);
        setMarkerPosition(newPos);
        onLocationSelect(newLat, newLng);

        if (markerRef.current) {
          markerRef.current.openPopup();
        }
      } else {
        alert("Lokasi tidak ditemukan.");
      }
    } catch (e) {
      alert("Gagal mencari lokasi.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      {showSearch && (
        <div className="flex gap-2 ">
          <Input
            placeholder="Cari lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            variant={"primary"}
            size={"md"}
          >
            {isSearching ? "Mencari..." : "Cari"}
          </Button>
        </div>
      )}

      <MapContainer
        attributionControl={false}
        center={mapCenter}
        zoom={15}
        scrollWheelZoom
        style={{
          ...baseContainerStyle,
          height: `${height ?? 300}px`,
        }}
      >
        <ChangeMapView center={mapCenter} />

        <TileLayer
          attribution=""
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={markerPosition}
          draggable
          ref={markerRef}
          eventHandlers={{
            mouseover: () => markerRef.current?.openPopup(),
            mouseout: () => markerRef.current?.closePopup(),
            dragend: (e) => {
              const pos = e.target.getLatLng();
              const lat = parseFloat(pos.lat.toFixed(6));
              const lng = parseFloat(pos.lng.toFixed(6));

              setMarkerPosition([lat, lng]);
              setMapCenter([lat, lng]);
              onLocationSelect(lat, lng);

              markerRef.current?.openPopup();
            },
          }}
        >
          <Popup>Anda bisa menggeser penanda ini.</Popup>
        </Marker>

        <MapClickHandler
          setMarkerPosition={setMarkerPosition}
          onLocationSelect={onLocationSelect}
          setMapCenter={setMapCenter}
        />

        {radius ? (
          <Circle
            center={markerPosition}
            radius={radius}
            pathOptions={{
              color: "blue",
              fillColor: "blue",
              fillOpacity: 0.2,
            }}
          />
        ) : null}
      </MapContainer>
    </div>
  );
}
