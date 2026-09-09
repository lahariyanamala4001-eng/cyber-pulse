import { User, Shield, Bell, Key, Clock, Building2 } from 'lucide-react';
import { useBankAuth } from '../../context/BankAuthContext';

export default function BankProfile() {
  const { user } = useBankAuth();

  if (!user) return null;

  return (
    <div className="p-4 sm:p-6 animate-fade-in max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <User size={22} color="#1e3a6e" /> Profile & Settings
        </h1>
        <p className="text-slate-500 text-sm">Manage your account and security preferences.</p>
      </div>

      {/* Profile Card */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-black"
            style={{ background: 'linear-gradient(135deg, #1e3a6e, #2563b0)' }}>
            {user.fullName.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">{user.fullName}</h2>
            <p className="text-sm text-slate-500 font-medium">{user.department}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="badge badge-resolved text-[10px]">{user.role.replace(/_/g, ' ').toUpperCase()}</span>
              <span className="badge badge-submitted text-[10px]">{user.bankBranch}</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: 'Employee ID', value: user.employeeId, icon: <Key size={14} /> },
            { label: 'Email', value: user.email, icon: <User size={14} /> },
            { label: 'Mobile', value: user.mobile, icon: <User size={14} /> },
            { label: 'Bank', value: user.bankName, icon: <Building2 size={14} /> },
            { label: 'Branch', value: user.bankBranch, icon: <Building2 size={14} /> },
            { label: 'Last Login', value: new Date(user.lastLogin).toLocaleString('en-IN'), icon: <Clock size={14} /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: '#f8fafc' }}>
              <span className="text-slate-400 mt-0.5">{icon}</span>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-slate-800">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permissions */}
      <div className="card p-6 mb-6">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Shield size={16} color="#1e3a6e" /> Permissions
        </h3>
        <div className="flex flex-wrap gap-2">
          {user.permissions.map(p => (
            <span key={p} className="text-xs px-3 py-1.5 rounded-lg font-medium"
              style={{ background: '#f0f4ff', color: '#1e3a6e', border: '1px solid #c7d7f8' }}>
              ✓ {p.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      </div>

      {/* Security Settings */}
      <div className="card p-6 mb-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Key size={16} color="#1e3a6e" /> Security
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-50">
            <div>
              <p className="text-sm font-semibold text-slate-800">Two-Factor Authentication</p>
              <p className="text-xs text-slate-500">Additional layer of security for your account.</p>
            </div>
            <span className={`badge ${user.twoFactorEnabled ? 'badge-resolved' : 'badge-pending'} text-[10px]`}>
              {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-50">
            <div>
              <p className="text-sm font-semibold text-slate-800">Session Timeout</p>
              <p className="text-xs text-slate-500">Auto-logout after inactivity.</p>
            </div>
            <span className="text-sm font-semibold text-slate-700">30 minutes</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">Password</p>
              <p className="text-xs text-slate-500">Last changed 45 days ago.</p>
            </div>
            <button className="btn-outline text-xs py-1.5 px-3">Change Password</button>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Bell size={16} color="#1e3a6e" /> Notification Preferences
        </h3>
        <div className="space-y-3">
          {[
            { label: 'CRITICAL Fraud Alerts', desc: 'Immediate push + email', enabled: true },
            { label: 'HIGH Fraud Alerts', desc: 'Push notification', enabled: true },
            { label: 'Case Updates', desc: 'In-app notification', enabled: true },
            { label: 'LEA Messages', desc: 'Push + email', enabled: true },
            { label: 'System Updates', desc: 'In-app only', enabled: false },
          ].map(pref => (
            <div key={pref.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-slate-700">{pref.label}</p>
                <p className="text-xs text-slate-400">{pref.desc}</p>
              </div>
              <div className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${
                pref.enabled ? 'bg-blue-600' : 'bg-slate-200'
              }`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  pref.enabled ? 'left-5' : 'left-1'
                }`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
