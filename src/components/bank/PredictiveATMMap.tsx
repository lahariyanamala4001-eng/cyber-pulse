import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ATMLocation, CashoutPrediction } from '../../types/bank';
import { getRiskLevelColor } from '../../services/mlService';

interface PredictiveATMMapProps {
  atmLocations: ATMLocation[];
  predictions?: CashoutPrediction[];
  height?: string;
  center?: [number, number];
  zoom?: number;
}

export default function PredictiveATMMap({
  atmLocations,
  predictions = [],
  height = '500px',
  center = [17.4200, 78.4500],
  zoom = 12,
}: PredictiveATMMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapRef.current).setView(center, zoom);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    // ATM markers
    atmLocations.forEach(atm => {
      const color = getRiskLevelColor(atm.riskZone);
      const isPredicted = predictions.some(p => p.predictedATM.id === atm.id);

      const icon = L.divIcon({
        className: 'custom-atm-marker',
        html: `
          <div style="
            width: ${isPredicted ? 32 : 24}px;
            height: ${isPredicted ? 32 : 24}px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            ${isPredicted ? 'animation: livePulse 2s infinite;' : ''}
          ">
            <span style="color:white;font-size:${isPredicted ? 12 : 10}px;font-weight:800;">₹</span>
          </div>
        `,
        iconSize: [isPredicted ? 32 : 24, isPredicted ? 32 : 24],
        iconAnchor: [isPredicted ? 16 : 12, isPredicted ? 16 : 12],
      });

      const prediction = predictions.find(p => p.predictedATM.id === atm.id);
      const popupContent = `
        <div style="font-family:'Inter',sans-serif;min-width:220px;">
          <div style="font-weight:800;font-size:14px;color:#0f172a;margin-bottom:4px;">${atm.name}</div>
          <div style="font-size:11px;color:#64748b;margin-bottom:8px;">${atm.address}</div>
          <div style="display:flex;gap:8px;margin-bottom:8px;">
            <span style="font-size:10px;padding:2px 8px;border-radius:100px;font-weight:700;background:${getRiskLevelColor(atm.riskZone)}15;color:${color};border:1px solid ${color}30;">
              ${atm.riskZone} RISK
            </span>
            <span style="font-size:10px;color:#64748b;">${atm.recentFraudCount} recent fraud(s)</span>
          </div>
          ${prediction ? `
            <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:8px;margin-top:6px;">
              <div style="font-weight:700;font-size:11px;color:#dc2626;margin-bottom:4px;">⚠️ PREDICTED CASH-OUT</div>
              <div style="font-size:11px;color:#991b1b;">
                Window: ${new Date(prediction.predictedTimeWindow.from).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} — ${new Date(prediction.predictedTimeWindow.to).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style="font-size:11px;color:#991b1b;">Confidence: ${(prediction.confidence * 100).toFixed(0)}%</div>
            </div>
          ` : ''}
          <div style="font-size:10px;color:#94a3b8;margin-top:6px;">Bank: ${atm.bank}</div>
        </div>
      `;

      L.marker([atm.lat, atm.lng], { icon })
        .addTo(map)
        .bindPopup(popupContent, { maxWidth: 280 });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [atmLocations, predictions, center, zoom]);

  return <div ref={mapRef} style={{ height, width: '100%', borderRadius: '12px' }} />;
}
