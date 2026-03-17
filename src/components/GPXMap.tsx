"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix missing marker icons in leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const defaultCenter: [number, number] = [49.7025, 20.4225]; // Limanowa approx

export default function GPXMap() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="w-full h-full bg-[#1A1A1A] animate-pulse rounded-2xl" />;

  // Mock route data for visual presentation
  const mockRoute: [number, number][] = [
    [49.7025, 20.4225],
    [49.7125, 20.4325],
    [49.7325, 20.4125],
    [49.7525, 20.4525],
    [49.7225, 20.4825]
  ];

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative z-0">
      <MapContainer
        center={defaultCenter}
        zoom={11}
        scrollWheelZoom={false}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Polyline positions={mockRoute} color="#B4000F" weight={4} opacity={0.8} />
      </MapContainer>
      <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
        <div className="px-3 py-1 bg-black/80 backdrop-blur-md rounded border border-white/10 text-white text-xs font-bold mb-1 w-fit">
          OSTATNIA TRASA
        </div>
        <div className="text-white text-sm font-medium drop-shadow-md">
          Przehyba, Pasmo Radziejowej
        </div>
      </div>
    </div>
  );
}
