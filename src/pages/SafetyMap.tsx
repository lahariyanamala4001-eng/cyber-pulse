import { useState, useEffect } from 'react';
import { MapPin, Search, Shield, Phone, Building2, Hospital, HelpingHand } from 'lucide-react';
import MapView from '../components/MapView';
import { mockSafetyLocations } from '../data/mockSafetyLocations';
import type { SafetyLocation } from '../data/mockSafetyLocations';

type FilterType = 'all' | SafetyLocation['type'];

const filterConfig: { type: FilterType; label: string; color: string; icon: React.ReactNode }[] = [
  { type: 'all', label: 'All', color: '#1e3a6e', icon: <MapPin size={13}/> },
  { type: 'police', label: 'Police Stations', color: '#1e3a6e', icon: <Shield size={13}/> },
  { type: 'cybercell', label: 'Cyber Cells', color: '#0f2040', icon: <Shield size={13}/> },
  { type: 'bank', label: 'Banks', color: '#166534', icon: <Building2 size={13}/> },
  { type: 'hospital', label: 'Hospitals', color: '#dc2626', icon: <Hospital size={13}/> },
  { type: 'assistance', label: 'Help Centres', color: '#7c3aed', icon: <HelpingHand size={13}/> },
];

export default function SafetyMap() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const filtered = mockSafetyLocations.filter(loc => {
    const matchType = activeFilter === 'all' || loc.type === activeFilter;
    const matchSearch = !search.trim() || loc.name.toLowerCase().includes(search.toLowerCase())
      || loc.address.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <MapPin size={20} color="#1e3a6e"/>
          <h1 className="text-2xl font-black text-slate-900">Cyber Safety & Assistance Map</h1>
        </div>
        <p className="text-slate-500 text-sm">Find police stations, cyber cells, banks and help centres near you.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          {/* Search */}
          <div className="card p-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2"><Search size={16} color="#94a3b8"/></div>
              <input type="text" className="form-input pl-9" placeholder="Search locations…"
                value={search} onChange={e => setSearch(e.target.value)} aria-label="Search locations"/>
            </div>
          </div>

          {/* Filters */}
          <div className="card p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Filter by Type</p>
            <div className="space-y-1.5">
              {filterConfig.map(f => (
                <button key={f.type} onClick={() => setActiveFilter(f.type)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === f.type ? 'text-white' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  style={{ background: activeFilter === f.type ? f.color : '' }}>
                  {f.icon} {f.label}
                  <span className="ml-auto text-xs opacity-70">
                    {f.type === 'all' ? mockSafetyLocations.length : mockSafetyLocations.filter(l => l.type === f.type).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Location List */}
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-bold text-slate-700">{filtered.length} location(s) found</p>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-slate-400">No locations found.</div>
              ) : (
                filtered.map(loc => {
                  const cfg = filterConfig.find(f => f.type === loc.type) || filterConfig[0];
                  return (
                    <div key={loc.id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: `${cfg.color}12`, color: cfg.color }}>
                          {cfg.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 leading-snug">{loc.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{loc.address}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs font-semibold flex items-center gap-1" style={{ color: cfg.color }}>
                              <Phone size={10}/> {loc.phone}
                            </span>
                            <span className="text-xs text-slate-400">{loc.hours}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Emergency */}
          <div className="card p-4" style={{ background: 'linear-gradient(135deg, #fef2f2, #fff)' , border: '1px solid #fecaca' }}>
            <p className="text-sm font-bold text-red-800 mb-2">🚨 Emergency Contacts</p>
            {[{ label: 'Cybercrime Helpline', value: '1930' }, { label: 'Police', value: '100' }, { label: 'National Emergency', value: '112' }].map(c => (
              <div key={c.label} className="flex justify-between items-center py-1">
                <span className="text-xs text-slate-600">{c.label}</span>
                <span className="text-sm font-black text-red-700">{c.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-700">Hyderabad Region (Demo)</p>
              <span className="badge badge-submitted">OpenStreetMap</span>
            </div>
            {mounted && (
              <MapView locations={filtered} height="520px"/>
            )}
          </div>

          <div className="mt-3 flex items-start gap-2 px-1">
            <div className="text-xs text-slate-400 flex flex-wrap gap-4">
              {filterConfig.slice(1).map(f => (
                <span key={f.type} className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full" style={{ background: f.color }}/>
                  {f.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
