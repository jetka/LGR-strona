"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Ten komponent ustala granice mapy tak, żeby objać całą trasę
function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      const bounds = positions.map((p) => [p[0], p[1]] as [number, number]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, positions]);

  return null;
}

export default function RouteMap({ routeData }: { routeData: any }) {
  if (!routeData || !Array.isArray(routeData) || routeData.length === 0) {
    return <div className="w-full h-full bg-[#111] flex items-center justify-center text-gray-500">Brak danych trasy do wyświetlenia</div>;
  }

  // Wymagany format to [lat, lng] dla polyline
  const positions: [number, number][] = routeData.map((p: any) => [p[0], p[1]]);

  return (
    <div className="w-full h-[50vh] md:h-[60vh] rounded-3xl overflow-hidden border border-white/10 relative z-0">
      <MapContainer
        center={positions[0]}
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
        style={{ background: '#f0f0f0' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />
        <Polyline positions={positions} pathOptions={{ color: "#B4000F", weight: 4, opacity: 0.9 }} />
        <FitBounds positions={positions} />
      </MapContainer>
    </div>
  );
}
