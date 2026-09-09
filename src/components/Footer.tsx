import { Link } from 'react-router-dom';
import { Shield, Phone, Mail, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto" style={{ background: '#0a1628', color: '#94a3b8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #1e3a6e, #2563b0)' }}>
                <Shield size={22} color="white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-black text-lg text-white">CyberPulse</div>
                <div className="text-xs" style={{ color: '#64748b' }}>Citizen Portal</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#64748b' }}>
              A secure platform for Indian citizens to report cybercrime, track complaints, and stay informed about digital threats.
            </p>
            <p className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', color: '#64748b', border: '1px solid rgba(255,255,255,0.06)' }}>
              This is a prototype. All data shown is fictional and for demonstration purposes only.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/report', label: 'Report Cybercrime' },
                { to: '/track', label: 'Track Complaint' },
                { to: '/safety-centre', label: 'Safety Centre' },
                { to: '/safety-map', label: 'Safety Map' },
                { to: '/alerts', label: 'Alerts' },
                { to: '/help', label: 'Help & Support' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: '#64748b' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Contacts */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Emergency Contacts</h3>
            <ul className="space-y-3">
              {[
                { label: 'Cybercrime Helpline', value: '1930', icon: <Phone size={13} /> },
                { label: 'National Emergency', value: '112', icon: <Phone size={13} /> },
                { label: 'Report Online', value: 'cybercrime.gov.in', icon: <ExternalLink size={13} /> },
                { label: 'Support Email', value: 'help@cyberpulse.gov.in', icon: <Mail size={13} /> },
              ].map((contact) => (
                <li key={contact.label} className="flex flex-col gap-0.5">
                  <span className="text-xs uppercase tracking-wider" style={{ color: '#475569' }}>{contact.label}</span>
                  <span className="text-sm font-semibold flex items-center gap-1.5 text-white">
                    {contact.icon} {contact.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2.5">
              {[
                'Privacy Policy',
                'Terms of Service',
                'Data Protection',
                'Accessibility',
                'Disclaimer',
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm cursor-pointer transition-colors hover:text-white" style={{ color: '#64748b' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Authority Portals */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Authority Portals</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/lea/login" className="text-sm transition-colors hover:text-white flex items-center gap-2" style={{ color: '#64748b' }}>
                  <Shield size={14} /> LEA Portal
                </Link>
              </li>
              <li>
                <Link to="/bank/login" className="text-sm transition-colors hover:text-white flex items-center gap-2" style={{ color: '#64748b' }}>
                  <ExternalLink size={14} /> Bank Authority Portal
                </Link>
              </li>
            </ul>
            <div className="mt-6 px-3 py-2 rounded-lg" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)' }}>
              <p className="text-xs" style={{ color: '#06b6d4' }}>
                🔒 Protected by AES-256 encryption. Your data is secure.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-xs" style={{ color: '#475569' }}>
            © {currentYear} CyberPulse — Cybercrime Intelligence & Response System. Government of India Prototype.
          </p>
          <p className="text-xs flex items-center gap-1.5" style={{ color: '#475569' }}>
            Made with <Heart size={11} color="#ef4444" fill="#ef4444" /> for citizen safety
          </p>
        </div>
      </div>
    </footer>
  );
}
