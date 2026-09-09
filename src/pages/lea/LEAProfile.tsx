import { User, Shield, Mail, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { useLEAAuth } from '../../context/LEAAuthContext';

export default function LEAProfile() {
  const { user } = useLEAAuth();

  if (!user) {
    return (
      <div className="p-6">
        <div className="card p-12 text-center">
          <User size={40} color="#94a3b8" className="mx-auto mb-3" />
          <p className="text-slate-500">Unable to load profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 animate-fade-in">
      <h1 className="text-2xl font-black text-slate-900 mb-6">Officer Profile</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card p-6 text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-black"
            style={{ background: 'linear-gradient(135deg, #1e3a6e, #2563b0)' }}>
            {user.fullName.charAt(0)}
          </div>
          <h2 className="text-lg font-black text-slate-900">{user.fullName}</h2>
          <p className="text-slate-500 text-sm">{user.rank}</p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="badge badge-submitted text-xs">
              <ShieldCheck size={10} /> {user.role === 'lea_admin' ? 'LEA Admin' : 'LEA Officer'}
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-400">Badge Number</div>
            <div className="text-sm font-mono font-bold text-slate-800 mt-0.5">{user.badgeNumber}</div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Officer Information */}
          <div className="card p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Shield size={16} color="#1e3a6e" /> Officer Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-500 font-semibold">Full Name</span>
                <p className="text-sm text-slate-800 mt-0.5">{user.fullName}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold">Officer ID</span>
                <p className="text-sm font-mono text-slate-800 mt-0.5">{user.id}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold">Department</span>
                <p className="text-sm text-slate-800 mt-0.5">{user.department}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold">Station</span>
                <p className="text-sm text-slate-800 mt-0.5">{user.station}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold">Rank</span>
                <p className="text-sm text-slate-800 mt-0.5">{user.rank}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold">Badge Number</span>
                <p className="text-sm font-mono text-slate-800 mt-0.5">{user.badgeNumber}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Mail size={16} color="#1e3a6e" /> Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <Mail size={16} color="#64748b" />
                <div>
                  <span className="text-xs text-slate-500">Email</span>
                  <p className="text-sm text-slate-800">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <Phone size={16} color="#64748b" />
                <div>
                  <span className="text-xs text-slate-500">Mobile</span>
                  <p className="text-sm text-slate-800">{user.mobile}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <MapPin size={16} color="#64748b" />
                <div>
                  <span className="text-xs text-slate-500">Station</span>
                  <p className="text-sm text-slate-800">{user.station}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="card p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ShieldCheck size={16} color="#1e3a6e" /> Security Settings
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div>
                  <span className="text-sm font-semibold text-slate-800">Two-Factor Authentication</span>
                  <p className="text-xs text-slate-500 mt-0.5">Additional security for your account</p>
                </div>
                <span className={`badge ${user.twoFactorEnabled ? 'badge-resolved' : 'badge-review'}`}>
                  {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div>
                  <span className="text-sm font-semibold text-slate-800">Last Login</span>
                  <p className="text-xs text-slate-500 mt-0.5">Most recent authentication</p>
                </div>
                <span className="text-sm text-slate-600 flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(user.lastLogin).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div>
                  <span className="text-sm font-semibold text-slate-800">Account Created</span>
                </div>
                <span className="text-sm text-slate-600">
                  {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="card p-6">
            <h3 className="font-bold text-slate-800 mb-4">Permissions</h3>
            <div className="flex gap-2 flex-wrap">
              {user.permissions.map(p => (
                <span key={p} className="badge badge-submitted text-xs capitalize">
                  {p.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
