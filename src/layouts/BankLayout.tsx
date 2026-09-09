import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Bell, AlertTriangle, ArrowLeftRight, FolderSearch,
  MapPin, Handshake, BarChart3, ScrollText, LogOut,
  ChevronLeft, ChevronRight, Search, User, Shield, Target, Menu, X,
  Crosshair, Activity
} from 'lucide-react';
import { useBankAuth } from '../context/BankAuthContext';

const NAV_ITEMS = [
  { to: '/bank/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/bank/ml-pipeline', icon: <Activity size={18} />, label: 'ML Pipeline Runner', badge: 'NEW' },
  { to: '/bank/alerts', icon: <AlertTriangle size={18} />, label: 'Fraud Alerts', badge: 5 },
  { to: '/bank/transactions', icon: <ArrowLeftRight size={18} />, label: 'Transactions' },
  { to: '/bank/cases', icon: <FolderSearch size={18} />, label: 'Fraud Cases' },
  { to: '/bank/cashout-predictions', icon: <Target size={18} />, label: 'Cash-out Predictions' },
  { to: '/bank/atm-map', icon: <MapPin size={18} />, label: 'Predictive ATM Map' },
  { to: '/bank/trace', icon: <Crosshair size={18} />, label: 'Fraud Trace' },
  { to: '/bank/risk-ml', icon: <BarChart3 size={18} />, label: 'Risk & ML View' },
  { to: '/bank/lea-coordination', icon: <Handshake size={18} />, label: 'LEA Coordination' },
  { to: '/bank/analytics', icon: <BarChart3 size={18} />, label: 'Analytics' },
  { to: '/bank/audit-logs', icon: <ScrollText size={18} />, label: 'Audit Logs' },
  { to: '/bank/notifications', icon: <Bell size={18} />, label: 'Notifications' },
];

export default function BankLayout() {
  const { user, logout } = useBankAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/bank/login');
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-3 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #14b8a6)' }}>
          <Shield size={18} color="white" />
        </div>
        {(!collapsed || isMobile) && (
          <div className="animate-fade-in">
            <div className="text-white font-black text-sm leading-tight">CyberPulse</div>
            <div className="text-cyan-300 text-[10px] font-semibold tracking-wider uppercase">Bank Authority</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => isMobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed && !isMobile ? 'justify-center' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {(!collapsed || isMobile) && (
              <span className="flex-1 text-sm font-medium">{item.label}</span>
            )}
            {item.badge && (!collapsed || isMobile) && (
              <span className="ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500 text-white">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle (desktop only) */}
      {!isMobile && (
        <div className="px-3 py-3 border-t border-white/10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sidebar-link w-full justify-center"
          >
            {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /> <span className="text-sm">Collapse</span></>}
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f1f5f9' }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out"
        style={{
          width: collapsed ? 72 : 260,
          background: 'linear-gradient(180deg, #0a1628 0%, #0f2040 50%, #162b55 100%)',
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside
            className="absolute left-0 top-0 bottom-0 w-72 flex flex-col animate-slide-in-right"
            style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0f2040 50%, #162b55 100%)' }}
          >
            <div className="absolute top-3 right-3">
              <button onClick={() => setMobileOpen(false)} className="p-2 text-white/60 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <SidebarContent isMobile />
          </aside>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex-shrink-0 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center gap-4"
          style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600">
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-md hidden sm:block">
            <div className="absolute left-3 top-1/2 -translate-y-1/2"><Search size={15} color="#94a3b8" /></div>
            <input
              type="text"
              placeholder="Search transactions, alerts, cases…"
              className="form-input pl-9 py-2 text-sm"
              aria-label="Search"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Notifications */}
            <Link to="/bank/notifications" className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <Bell size={18} color="#64748b" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-notification-ping" />
            </Link>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, #1e3a6e, #2563b0)' }}>
                  {user?.fullName?.charAt(0) || 'B'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-semibold text-slate-800 leading-tight">{user?.fullName}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{user?.department}</div>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 card p-2 shadow-xl z-50 animate-fade-in">
                  <Link to="/bank/profile" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    <User size={15} /> Profile & Settings
                  </Link>
                  <Link to="/bank/audit-logs" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    <ScrollText size={15} /> Audit Logs
                  </Link>
                  <hr className="my-1 border-slate-100" />
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main id="main-content" className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
