import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
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

L.Marker.prototype.options.icon = DefaultIcon;

const LocationPicker = ({ onLocationSelect, initialPosition }) => {
    const [position, setPosition] = useState(initialPosition || [20.5937, 78.9629]); // Default to India center

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                setPosition([e.latlng.lat, e.latlng.lng]);
                onLocationSelect({
                    lat: e.latlng.lat,
                    lng: e.latlng.lng
                });
            },
        });

        return position === null ? null : (
            <Marker position={position}></Marker>
        );
    };

    const SetViewOnClick = ({ coords }) => {
        const map = useMap();
        useEffect(() => {
            if (coords) {
                map.setView(coords, map.getZoom());
            }
        }, [coords, map]);
        return null;
    };

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const newPos = [pos.coords.latitude, pos.coords.longitude];
                setPosition(newPos);
                onLocationSelect({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-green)]">Pin Location</span>
                <button 
                    type="button"
                    onClick={handleGetLocation}
                    className="text-[9px] font-black uppercase tracking-widest text-[var(--accent-green)] hover:underline"
                >
                    Use my location
                </button>
            </div>
            <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-inner">
                <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker />
                    <SetViewOnClick coords={position} />
                </MapContainer>
            </div>
        </div>
    );
};

export default LocationPicker;
