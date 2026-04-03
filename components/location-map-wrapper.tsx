"use client";

import dynamic from "next/dynamic";

// Dynamically import LocationMap with no SSR to avoid window errors
const LocationMap = dynamic(() => import("@/components/location-map"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-gray-100 animate-pulse flex items-center justify-center">
            <div className="text-gray-400 text-sm">Karte wird geladen...</div>
        </div>
    ),
});

export default function LocationMapWrapper() {
    return <LocationMap />;
}
