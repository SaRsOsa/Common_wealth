import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Layers, RefreshCw } from "lucide-react";
import { useQuery } from "react-query";
import { api } from "../api";

interface EventData {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: string;
  lat: number;
  lng: number;
  country: string;
  date: string;
}

const eventTypeColors: Record<string, string> = {
  Social: "#3b82f6",
  Political: "#ef4444",
  Environmental: "#10b981",
  Economic: "#f59e0b"
};

export function MapView() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    Social: true,
    Political: true,
    Environmental: true,
    Economic: true
  });
  const [markers, setMarkers] = useState<L.Marker[]>([]);

  const { data, isLoading, error, refetch } = useQuery<EventData[], Error>(
    "mapEvents",
    () => api.get("/gdelt-events").then(res => res.data),
    {
      refetchInterval: 300000,
      retry: 2
    }
  );

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([20, 0], 2);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current || !data) return;

    // Clear existing markers
    markers.forEach((marker: L.Marker) => marker.removeFrom(mapRef.current!));

    const newMarkers = data
      .filter(event => activeLayers[event.type])
      .map((event: EventData) => {
        const marker = L.marker([event.lat, event.lng], {
          icon: L.divIcon({
            className: "event-marker",
            html: `<div style="background-color: ${eventTypeColors[event.type]}" 
                   class="w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>`
          })
        });

        marker.bindPopup(`
          <div class="space-y-2">
            <h3 class="font-semibold">${event.title}</h3>
            ${event.description.includes("http") ?
            `<img src="${event.description}" class="w-full h-32 object-cover mb-2">` :
            `<p>${event.description}</p>`}
            <div class="text-sm text-gray-600">
              ${event.country} • ${new Date(event.date).toLocaleDateString()}
            </div>
          </div>
        `);

        return marker.addTo(mapRef.current!);
      });

    setMarkers(newMarkers);

    return () => {
      newMarkers.forEach(marker => marker.remove());
    };
  }, [data, activeLayers]);

  const toggleLayer = (layer: string) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="h-full space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Real-time Map View</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => refetch()}
            className="flex items-center px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <div className="dropdown relative">
            <button className="flex items-center px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50">
              <Layers className="w-4 h-4 mr-2" />
              Layers
            </button>
            <div className="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-2 space-y-2">
              {Object.entries(activeLayers).map(([layer, active]) => (
                <label
                  key={layer}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleLayer(layer)}
                    className="form-checkbox h-4 w-4"
                  />
                  <span style={{ color: eventTypeColors[layer] }}>
                    {layer}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="bg-white p-4 rounded-lg shadow-sm h-[calc(100vh-12rem)] animate-pulse">
          <div className="h-full w-full rounded-lg bg-gray-100" />
        </div>
      )}

      {error && (
        <div className="bg-white p-4 rounded-lg shadow-sm text-red-500">
          Error loading map data: {error.message}
          <button
            onClick={() => refetch()}
            className="ml-2 text-blue-500 hover:text-blue-700"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="bg-white p-4 rounded-lg shadow-sm h-[calc(100vh-12rem)]">
          <div ref={mapContainerRef} className="h-full w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}