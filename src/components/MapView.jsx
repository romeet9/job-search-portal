import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet icons in React
import 'leaflet/dist/leaflet.css';

const CITY_BOUNDS = {
  bengaluru: { center: [12.9716, 77.5946], zoom: 12 },
  mumbai:    { center: [19.0760, 72.8777], zoom: 12 },
  delhi:     { center: [28.6139, 77.2090], zoom: 11 },
};

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom]);
  return null;
}

export default function MapView({ jobs, activeCity, selectedJobId, onMarkerClick }) {
  const city = CITY_BOUNDS[activeCity] || CITY_BOUNDS.bengaluru;

  const createIcon = (job, isSelected) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="relative group">
          <div class="w-10 h-10 rounded-xl glass flex items-center justify-center p-1.5 shadow-2xl transition-all duration-300 ${isSelected ? 'scale-125 border-white ring-4 ring-white/20' : 'border-white/10 grayscale-[0.5] group-hover:grayscale-0'}">
            <img src="${job.logo_url}" class="w-full h-full object-contain rounded-md" />
          </div>
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 rounded-sm shadow-xl"></div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });
  };

  return (
    <div className="w-full h-full">
      <MapContainer 
        center={city.center} 
        zoom={city.zoom} 
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        
        <ChangeView center={city.center} zoom={city.zoom} />

        {jobs.map(job => (
          <Marker 
            key={job.id} 
            position={[job.lat, job.lng]}
            icon={createIcon(job, job.id === selectedJobId)}
            eventHandlers={{
              click: () => onMarkerClick(job.id)
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
