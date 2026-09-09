import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Shield,
  Bell,
  User,
  Menu,
  X,
  ChevronDown,
  FileWarning,
  Search,
  ShieldCheck,
  Phone,
  Home,
  LogOut,
  Settings,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockAlerts } from '../data/mockAlerts';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = mockAlerts.filter((a) => !a.isRead && !a.isDismissed).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setProfileOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: <Home size={15} /> },
    { to: '/report', label: 'Report Cybercrime', icon: <FileWarning size={15} /> },
    { to: '/track', label: 'Track Complaint', icon: <Search size={15} /> },
    { to: '/safety-centre', label: 'Safety Centre', icon: <ShieldCheck size={15} /> },
    { to: '/alerts', label: 'Alerts', icon: <Bell size={15} /> },
    { to: '/help', label: 'Help', icon: <Phone size={15} /> },
  ];

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0" aria-label="CyberPulse Home">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #1e3a6e 0%, #2563b0 100%)' }}>
              <Shield size={20} color="white" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <div className="font-black text-lg leading-tight" style={{ color: '#0f2040' }}>
                CyberPulse
              </div>
              <div className="text-xs font-medium" style={{ color: '#64748b' }}>
                Citizen Portal
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                id="notification-bell"
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-colors duration-200 hover:bg-slate-100"
                aria-label={`Notifications, ${unreadCount} unread`}
                aria-expanded={notifOpen}
              >
                <Bell size={20} color="#374151" />
                {unreadCount > 0 && (
                  <span
                    className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold animate-notification-ping"
                    style={{ background: '#ef4444', fontSize: '9px' }}
                    aria-hidden="true"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 card z-50 animate-fade-in overflow-hidden" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-800">Notifications</span>
                    <span className="badge badge-submitted">{unreadCount} new</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {mockAlerts.slice(0, 4).map((alert) => (
                      <div
                        key={alert.id}
                        className={`px-4 py-3 border-b border-slate-50 transition-colors hover:bg-slate-50 ${!alert.isRead ? 'bg-blue-50/40' : ''}`}
                      >
                        <div className="flex gap-3">
                          <div className={`mt-0.5 flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                            alert.severity === 'high' ? 'bg-red-500' :
                            alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                          }`} />
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{alert.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{alert.message}</p>
                            <p className="text-xs text-slate-400 mt-1">{alert.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 bg-slate-50">
                    <Link
                      to="/alerts"
                      onClick={() => setNotifOpen(false)}
                      className="text-sm font-semibold text-blue-700 hover:text-blue-900"
                    >
                      View all alerts →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  id="profile-menu-btn"
                  onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors hover:bg-slate-100"
                  aria-label="Profile menu"
                  aria-expanded={profileOpen}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg, #1e3a6e, #2563b0)' }}>
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden md:block text-sm font-semibold text-slate-700 max-w-24 truncate">
                    {user?.fullName?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown size={14} color="#64748b" className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-56 card z-50 animate-fade-in overflow-hidden"
                    style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-800">{user?.fullName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/dashboard" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        <Home size={15} color="#64748b" /> Dashboard
                      </Link>
                      <Link to="/profile" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        <Settings size={15} color="#64748b" /> My Profile
                      </Link>
                      <Link to="/alerts" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        <AlertTriangle size={15} color="#64748b" /> Alerts
                      </Link>
                    </div>
                    <div className="py-1 border-t border-slate-100">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-outline py-2 px-4 text-sm">Login</Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">
                  <User size={14} /> Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} color="#374151" /> : <Menu size={20} color="#374151" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-800' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {link.icon} {link.label}
              </NavLink>
            ))}
            {!isAuthenticated && (
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary w-full justify-center">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary w-full justify-center">
                  <User size={15} /> Create Account
                </Link>
              </div>
            )}
            {isAuthenticated && (
              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={15} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
