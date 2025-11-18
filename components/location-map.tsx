"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";

// Fix for default marker icon in Leaflet with Next.js
const createCustomIcon = () => {
    return L.divIcon({
        className: 'custom-map-marker',
        html: `
            <div style="
                background: black;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                border: 3px solid white;
            ">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                </svg>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
    });
};

interface LocationMapProps {
    latitude?: number;
    longitude?: number;
    locationName?: string;
    address?: string;
}

export default function LocationMap({
    latitude = 49.2401,
    longitude = 6.9969,
    locationName = "Nicolas Klein Photography",
    address = "Heinrich-Köhl-Str. 41, 66113 Saarbrücken"
}: LocationMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Initialize the map
        const map = L.map(mapRef.current, {
            center: [latitude, longitude],
            zoom: 13,
            scrollWheelZoom: false,
            zoomControl: true,
        });

        mapInstanceRef.current = map;

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(map);

        // Add custom marker
        const customIcon = createCustomIcon();
        const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);

        // Add popup to marker
        marker.bindPopup(`
            <div style="
                padding: 8px;
                font-family: system-ui, -apple-system, sans-serif;
            ">
                <strong style="
                    display: block;
                    margin-bottom: 4px;
                    font-size: 14px;
                ">${locationName}</strong>
                <span style="
                    font-size: 12px;
                    color: #666;
                ">${address}</span>
            </div>
        `);

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [latitude, longitude, locationName, address]);

    return (
        <div className="w-full">
            <div
                ref={mapRef}
                className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-lg border border-gray-200"
                style={{ zIndex: 0 }}
            />
            <div className="mt-4 text-center text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                    <MapPin size={16} />
                    <span>Saarbrücken, Deutschland</span>
                </div>
                <p className="mt-2 text-xs">
                    Klicke auf den Marker für mehr Informationen
                </p>
            </div>
        </div>
    );
}
