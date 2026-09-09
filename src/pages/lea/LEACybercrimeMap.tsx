import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import {
  Filter, AlertTriangle, RefreshCw, Map as MapIcon, Info, X,
} from 'lucide-react';
import { leaMapService } from '../../services/leaApi';
import type { CybercrimeHotspot, LEACrimeCategory } from '../../types/lea';
import 'leaflet/dist/leaflet.css';

export default function LEACybercrimeMap() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hotspots, setHotspots] = useState<CybercrimeHotspot[]>([]);
  const [filterCategory, setFilterCategory] = useState<LEACrimeCategory | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchHotspots = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await leaMapService.getHotspots();
      setHotspots(data);
    } catch {
      setError('Failed to load hotspot data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHotspots(); }, []);

  const severityColor = (severity: string): string => {
    switch (severity) {
      case 'Critical': return '#dc2626';
      case 'High': return '#ea580c';
      case 'Medium': return '#d97706';
      default: return '#16a34a';
    }
  };

  const severityRadius = (severity: string): number => {
    switch (severity) {
      case 'Critical': return 18;
      case 'High': return 14;
      case 'Medium': return 10;
      default: return 7;
    }
  };

  const filtered = hotspots.filter(h => {
    if (filterCategory && h.crimeCategory !== filterCategory) return false;
    return true;
  });

  const priorityStyle = (p: string) => {
    switch (p) {
      case 'Critical': return { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' };
      case 'High': return { background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' };
      case 'Medium': return { background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' };
      default: return { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' };
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="card p-12 text-center">
          <AlertTriangle size={40} color="#dc2626" className="mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Map Unavailable</h2>
          <p className="text-slate-500 mb-4">{error}</p>
          <button onClick={fetchHotspots} className="btn-primary"><RefreshCw size={14} /> Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <MapIcon size={24} color="#1e3a6e" /> Cybercrime Hotspot Map
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Aggregated cybercrime locations across India. No citizen PII displayed.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-outline py-1.5 px-3 text-xs flex items-center gap-1 ${showFilters ? 'bg-slate-50' : ''}`}
          >
            <Filter size={12} /> Filters
          </button>
          <button onClick={fetchHotspots} className="btn-outline py-1.5 px-3 text-xs flex items-center gap-1">
            <RefreshCw size={11} /> Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card p-4 mb-4 animate-fade-in">
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Crime Category</label>
              <select className="form-input py-2 text-sm" value={filterCategory}
                onChange={e => setFilterCategory(e.target.value as LEACrimeCategory | '')}>
                <option value="">All Categories</option>
                {['Online Financial Fraud', 'UPI / Payment Fraud', 'Phishing / Fake Link', 'Social Media Fraud',
                  'Identity Theft', 'Cyber Harassment', 'Account Hacking', 'Fake Website / App', 'Investment Scam', 'Job Scam'
                ].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {filterCategory && (
              <button onClick={() => setFilterCategory('')} className="btn-outline py-2 px-3 text-sm text-red-600 border-red-200 hover:bg-red-50">
                <X size={12} /> Clear
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3">
          <div className="card overflow-hidden" style={{ height: '600px' }}>
            {loading ? (
              <div className="w-full h-full shimmer" />
            ) : (
              <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filtered.map(h => (
                  <CircleMarker
                    key={h.id}
                    center={[h.lat, h.lng]}
                    radius={severityRadius(h.severity)}
                    pathOptions={{
                      color: severityColor(h.severity),
                      fillColor: severityColor(h.severity),
                      fillOpacity: 0.35,
                      weight: 2,
                    }}
                  >
                    <Popup>
                      <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '200px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
                          {h.area}, {h.city}
                        </h3>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ ...priorityStyle(h.severity), padding: '2px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: 600 }}>
                            {h.severity}
                          </span>
                          <span style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', padding: '2px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: 600 }}>
                            {h.crimeCategory}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
                          <div><strong>Cases:</strong> {h.caseCount}</div>
                          <div><strong>Recent:</strong> {h.recentActivity}</div>
                          <div><strong>Period:</strong> {h.timeRange}</div>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            )}
          </div>
        </div>

        {/* Sidebar — Legend + Stats */}
        <div className="space-y-5">
          {/* Legend */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-3">Severity Legend</h3>
            <div className="space-y-2">
              {[
                { level: 'Critical', color: '#dc2626' },
                { level: 'High', color: '#ea580c' },
                { level: 'Medium', color: '#d97706' },
                { level: 'Low', color: '#16a34a' },
              ].map(l => (
                <div key={l.level} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ background: l.color, opacity: 0.6 }} />
                  <span className="text-sm text-slate-700">{l.level}</span>
                  <span className="ml-auto text-xs text-slate-400">
                    {filtered.filter(h => h.severity === l.level).length}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Hotspots */}
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">Top Hotspots</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {filtered
                .sort((a, b) => b.caseCount - a.caseCount)
                .slice(0, 5)
                .map(h => (
                  <div key={h.id} className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-800">{h.area}, {h.city}</span>
                      <span className="badge text-[10px]" style={priorityStyle(h.severity)}>{h.severity}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{h.crimeCategory} — {h.caseCount} cases</div>
                  </div>
                ))}
            </div>
          </div>

          {/* Predictive Intelligence placeholder */}
          <div className="card p-5" style={{ border: '1px dashed #d97706' }}>
            <div className="flex items-center gap-2 mb-2">
              <Info size={14} color="#d97706" />
              <h3 className="font-bold text-amber-700 text-sm">Predictive Intelligence</h3>
            </div>
            <p className="text-xs text-amber-600 leading-relaxed">
              ML model integration pending. When connected, this section will display predictive hotspot data, risk levels, and predicted time windows.
            </p>
            <p className="text-[10px] text-amber-500 mt-2 italic">
              Note: Predictive data will be clearly labeled. Predictions are not confirmed facts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
