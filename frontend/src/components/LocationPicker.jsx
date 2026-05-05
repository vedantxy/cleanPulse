import { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const LocationPicker = ({ onLocationSelect, initialPosition }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markerRef = useRef(null);
    const [position, setPosition] = useState(initialPosition || null);

    const defaultCenter = [20.5937, 78.9629];

    useEffect(() => {
        if (!mapRef.current) return;

        // Initialize map
        if (!mapInstance.current) {
            mapInstance.current = L.map(mapRef.current).setView(position || defaultCenter, 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapInstance.current);

            mapInstance.current.on('click', (e) => {
                const { lat, lng } = e.latlng;
                const newPos = { lat, lng };
                setPosition(newPos);
                onLocationSelect(newPos);
            });
        }

        // Cleanup function
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    // Effect to handle marker updates
    useEffect(() => {
        if (!mapInstance.current) return;

        if (position) {
            if (markerRef.current) {
                markerRef.current.setLatLng(position);
            } else {
                markerRef.current = L.marker(position, { icon: DefaultIcon }).addTo(mapInstance.current);
            }
        }
    }, [position]);

    // Effect to handle initialPosition updates (for Edit mode)
    useEffect(() => {
        if (initialPosition && (!position || initialPosition[0] !== position.lat)) {
            const newPos = { lat: initialPosition[0], lng: initialPosition[1] };
            setPosition(newPos);
            if (mapInstance.current) {
                mapInstance.current.setView(newPos, 13);
            }
        }
    }, [initialPosition]);

    return (
        <div className="h-[400px] w-full rounded-[2.5rem] overflow-hidden border-2 border-[var(--border-color)] shadow-inner relative z-10 transition-all hover:border-[var(--accent-green)]/30">
            <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
            <div className="absolute top-4 right-4 z-[1000] bg-[var(--bg-card)]/80 backdrop-blur-md p-3 rounded-2xl border border-[var(--border-color)] pointer-events-none">
                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--accent-green)]">Click map to pin location</p>
            </div>
            {position && (
                <div className="absolute bottom-4 left-4 z-[1000] bg-[var(--bg-card)]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-[var(--border-color)] text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                    Lat: {position.lat?.toFixed(4)} | Lng: {position.lng?.toFixed(4)}
                </div>
            )}
        </div>
    );
};

export default LocationPicker;
