import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
interface CityMapProps {
  locations: { name: string; position: [number, number]; data?: any }[];
  onCityClick: (city: any) => void;
}
const CityMapWithData: React.FC<CityMapProps> = ({ locations, onCityClick }) => {
  const center = useMemo(() => {
    if (locations.length > 0) return locations[0].position;
    return [39.8283, -98.5795] as [number, number];
  }, [locations]);
  return (
    <div className="w-full h-96 rounded-xl overflow-hidden shadow-md border border-gray-200 z-0 relative">
      <MapContainer center={center} zoom={4} className="w-full h-full z-0">
        <TileLayer
          attribution='&amp;copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc, idx) => (
          <Marker 
             key={idx} 
             position={loc.position} 
             eventHandlers={{ click: () => onCityClick(loc) }}
          >
            <Popup>
              <strong>{loc.name}</strong>
              <div className="mt-2 text-sm text-yelp-red cursor-pointer">
                View Data
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
export default CityMapWithData;
