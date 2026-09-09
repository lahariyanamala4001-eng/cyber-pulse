import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { SafetyLocation } from '../data/mockSafetyLocations';

// Fix Leaflet default icon paths broken by Vite bundling
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const markerColors: Record<SafetyLocation['type'], string> = {
  police: '#1e3a6e',
  cybercell: '#0f2040',
  bank: '#166534',
  hospital: '#dc2626',
  assistance: '#7c3aed',
};

const markerLabels: Record<SafetyLocation['type'], string> = {
  police: '🚔',
  cybercell: '🛡️',
  bank: '🏦',
  hospital: '🏥',
  assistance: '🤝',
};

function createCustomIcon(type: SafetyLocation['type']): L.DivIcon {
  const color = markerColors[type];
  const emoji = markerLabels[type];
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="transform: rotate(45deg); font-size: 16px; display: block; text-align: center; line-height: 30px;">
          ${emoji}
        </span>
      </div>
    `,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

interface MapViewProps {
  locations: SafetyLocation[];
  height?: string;
}

export default function MapView({ locations, height = '500px' }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [17.3850, 78.4867],
      zoom: 12,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    locations.forEach((loc) => {
      const icon = createCustomIcon(loc.type);
      const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; min-width: 200px; padding: 4px 0;">
          <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">${loc.name}</div>
          <div style="display: inline-block; padding: 2px 8px; border-radius: 100px; background: ${markerColors[loc.type]}18; color: ${markerColors[loc.type]}; font-size: 11px; font-weight: 600; margin-bottom: 8px;">
            ${loc.type === 'cybercell' ? 'Cyber Cell' : loc.type.charAt(0).toUpperCase() + loc.type.slice(1)}
          </div>
          <div style="font-size: 12px; color: #475569; margin-bottom: 4px;">📍 ${loc.address}</div>
          <div style="font-size: 12px; color: #475569; margin-bottom: 4px;">📞 ${loc.phone}</div>
          <div style="font-size: 12px; color: #475569;">🕐 ${loc.hours}</div>
        </div>
      `, { maxWidth: 280 });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [locations]);

  return (
    <div
      ref={containerRef}
      style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden' }}
      aria-label="Safety locations map"
      role="application"
    />
  );
}
