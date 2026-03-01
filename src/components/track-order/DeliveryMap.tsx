"use client";

import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

// Custom robot icon representing Aiel Enterprises
const robotIcon = new L.Icon({
    iconUrl: "/logo_new.jpg", // Using logo as a fun marker
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: "rounded-full border-2 border-primary-500 bg-white drop-shadow-md",
});

const homeIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
});

interface DeliveryMapProps {
    status: string;
    coordinates?: [number, number]; // Customer destination if known
    progress?: number; // 0 to 100 representing journey progress
}

// Aiel Enterprises warehouse (Default Puducherry coordinate)
const WAREHOUSE_COORDS: [number, number] = [11.9416, 79.8083];

// Helper to center the map
function MapController({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom(), { animate: true });
    }, [center, map]);
    return null;
}

export default function DeliveryMap({ status, coordinates, progress = 50 }: DeliveryMapProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Placeholder customer location (Slightly away from warehouse if none provided)
    const destinationCoords: [number, number] = coordinates || [11.95, 79.82];

    // Calculate intermediate point for animation based on progress
    const activeCoords: [number, number] = useMemo(() => {
        if (["Delivered", "Delivered "].includes(status)) return destinationCoords;
        if (status === "Order Placed" || status === "Processing") return WAREHOUSE_COORDS;

        // Interpolate position based on progress
        const ratio = progress / 100;
        const lat = WAREHOUSE_COORDS[0] + (destinationCoords[0] - WAREHOUSE_COORDS[0]) * ratio;
        const lng = WAREHOUSE_COORDS[1] + (destinationCoords[1] - WAREHOUSE_COORDS[1]) * ratio;
        
        return [lat, lng];
    }, [status, progress, destinationCoords]);


    if (!mounted) {
        return (
            <div className="w-full h-64 bg-slate-100 rounded-xl flex items-center justify-center animate-pulse">
                <span className="text-slate-400 font-medium tracking-widest text-sm uppercase">Loading Map...</span>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden border border-surface-200 shadow-sm z-10">
            <MapContainer
                center={activeCoords}
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController center={activeCoords} />

                {/* Warehouse Marker */}
                <Marker position={WAREHOUSE_COORDS}>
                    <Popup>Aiel Enterprises Warehouse</Popup>
                </Marker>

                {/* Customer Location Marker */}
                <Marker position={destinationCoords} icon={homeIcon}>
                    <Popup>Delivery Address</Popup>
                </Marker>

                {/* Path from Warehouse to Customer */}
                <Polyline 
                    positions={[WAREHOUSE_COORDS, activeCoords]} 
                    color="#06b6d4" 
                    dashArray="5, 10" 
                    weight={4} 
                    className="opacity-70 animate-[dash_20s_linear_infinite]"
                />
                 <Polyline 
                    positions={[activeCoords, destinationCoords]} 
                    color="#94a3b8" 
                    dashArray="5, 10" 
                    weight={3} 
                    className="opacity-40"
                />

                {/* Delivery Boy (Active Marker) */}
                <Marker position={activeCoords} icon={robotIcon}>
                    <Popup autoPan={false}>
                        <div className="text-center font-semibold text-primary-600">
                            {status === "Delivered" ? "Delivered!" : "On the way!"}
                        </div>
                    </Popup>
                </Marker>

            </MapContainer>
            
            {/* Overlay Gradient for playful styling */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-[400]" />
        </div>
    );
}
