import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Bell, Shield, Lock, LogOut, ChevronRight, Edit2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockComplaints } from '../data/mockComplaints';
import StatusBadge from '../components/StatusBadge';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'complaints' | 'notifications' | 'security'>('profile');

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    preferredContact: user?.preferredContact || 'both',
  });

  const handleSave = () => {
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <User size={15}/> },
    { id: 'complaints', label: 'My Complaints', icon: <Shield size={15}/> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={15}/> },
    { id: 'security', label: 'Security', icon: <Lock size={15}/> },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-black flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1e3a6e, #2563b0)' }}>
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-slate-900">{user?.fullName}</h1>
            <p className="text-slate-500 text-sm">{user?.email}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="badge badge-submitted">Citizen Account</span>
              <span className="badge badge-resolved">Verified</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-danger flex-shrink-0">
            <LogOut size={15}/> Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto mb-6 bg-white border border-slate-200 rounded-xl p-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-shrink-0 ${
              activeTab === tab.id
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-800 text-lg">Personal Information</h2>
            <button onClick={() => setEditMode(!editMode)} className="btn-outline text-sm flex items-center gap-1.5">
              <Edit2 size={13}/> {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {saved && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-5 text-sm text-green-800 animate-fade-in"
              style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <Check size={15} color="#166534"/> Profile updated successfully.
            </div>
          )}

          <div className="space-y-4">
            {[
              { label: 'Full Name', key: 'fullName', icon: <User size={15}/>, type: 'text' },
              { label: 'Email Address', key: 'email', icon: <Mail size={15}/>, type: 'email' },
              { label: 'Mobile Number', key: 'mobile', icon: <Phone size={15}/>, type: 'tel' },
            ].map(field => (
              <div key={field.key}>
                <label className="form-label flex items-center gap-1.5">{field.icon} {field.label}</label>
                {editMode ? (
                  <input type={field.type} className="form-input"
                    value={form[field.key as keyof typeof form] as string}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}/>
                ) : (
                  <div className="py-2.5 px-4 rounded-xl text-sm text-slate-800 font-medium"
                    style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0' }}>
                    {form[field.key as keyof typeof form] as string || '—'}
                  </div>
                )}
              </div>
            ))}

            <div>
              <label className="form-label">Preferred Communication</label>
              {editMode ? (
                <div className="flex gap-4">
                  {(['mobile', 'email', 'both'] as const).map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                      <input type="radio" value={opt} checked={form.preferredContact === opt}
                        onChange={() => setForm(f => ({ ...f, preferredContact: opt }))} className="accent-blue-700"/>
                      {opt === 'mobile' ? 'SMS/Call' : opt === 'email' ? 'Email' : 'Both'}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="py-2.5 px-4 rounded-xl text-sm text-slate-800 font-medium capitalize"
                  style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0' }}>
                  {form.preferredContact === 'both' ? 'SMS/Call & Email' : form.preferredContact}
                </div>
              )}
            </div>
          </div>

          {editMode && (
            <div className="mt-6 flex gap-3">
              <button onClick={handleSave} className="btn-primary">
                <Check size={15}/> Save Changes
              </button>
              <button onClick={() => setEditMode(false)} className="btn-outline">Cancel</button>
            </div>
          )}
        </div>
      )}

      {/* Complaints Tab */}
      {activeTab === 'complaints' && (
        <div className="card overflow-hidden animate-fade-in">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">My Complaints ({mockComplaints.length})</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {mockComplaints.map(c => (
              <div key={c.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                <div>
                  <span className="font-mono text-sm font-bold text-blue-700">{c.id}</span>
                  <p className="text-sm text-slate-700 mt-0.5">{c.type}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Incident: {c.incidentDate} · Updated: {c.lastUpdated}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={c.status} size="sm"/>
                  <button onClick={() => navigate(`/track?id=${c.id}`)}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors">
                    View <ChevronRight size={12}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="card p-6 animate-fade-in">
          <h2 className="font-bold text-slate-800 text-lg mb-5">Notification Preferences</h2>
          <div className="space-y-4">
            {[
              { label: 'Complaint Status Updates', desc: 'Get notified when your complaint status changes', enabled: true },
              { label: 'Safety Alerts', desc: 'Receive important cybersecurity alerts and warnings', enabled: true },
              { label: 'New Assignments', desc: 'Notifications when your case is assigned to an authority', enabled: true },
              { label: 'Resolution Notifications', desc: 'Get notified when your complaint is resolved', enabled: true },
              { label: 'Weekly Safety Digest', desc: 'A weekly summary of cybercrime trends and tips', enabled: false },
              { label: 'Marketing Communications', desc: 'Updates about new portal features', enabled: false },
            ].map((pref, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{pref.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{pref.desc}</p>
                </div>
                <label className="relative inline-flex cursor-pointer flex-shrink-0 ml-4">
                  <input type="checkbox" defaultChecked={pref.enabled} className="sr-only peer"/>
                  <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-700 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-5 animate-fade-in">
          <div className="card p-6">
            <h2 className="font-bold text-slate-800 text-lg mb-5">Account Security</h2>
            <div className="space-y-4">
              {[
                { label: 'Last Login', value: user?.lastLogin ? new Date(user.lastLogin).toLocaleString('en-IN') : 'Unknown' },
                { label: 'Login Method', value: user?.loginMethod || 'Password' },
                { label: 'Two-Factor Authentication', value: user?.twoFactorEnabled ? '✅ Enabled' : '❌ Not enabled' },
                { label: 'Account Created', value: user?.createdAt || 'Unknown' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <span className="text-sm font-semibold text-slate-600">{label}</span>
                  <span className="text-sm text-slate-800 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-slate-800 mb-4">Security Actions</h3>
            <div className="space-y-3">
              {[
                { label: 'Change Password', desc: 'Update your account password' },
                { label: 'Enable Two-Factor Authentication', desc: 'Add an extra layer of security' },
                { label: 'Active Sessions', desc: 'View and manage your login sessions' },
                { label: 'Privacy Settings', desc: 'Control who can see your complaint information' },
              ].map(action => (
                <div key={action.label}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{action.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{action.desc}</p>
                  </div>
                  <ChevronRight size={16} color="#94a3b8"/>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
            <h3 className="font-bold text-red-800 mb-2 text-sm">Danger Zone</h3>
            <p className="text-xs text-red-700 mb-3">These actions are irreversible. Please proceed with caution.</p>
            <button className="btn-danger text-sm">Delete My Account</button>
          </div>
        </div>
      )}
    </div>
  );
}
