import { useState } from 'react';
import { Phone, Mail, ExternalLink, ChevronDown, ChevronUp, HelpCircle, MessageCircle } from 'lucide-react';

const faqs = [
  {
    q: 'How do I report a cybercrime?',
    a: 'Click "Report Cybercrime" in the top navigation or from the dashboard. You\'ll be guided through a simple 5-step form. You don\'t need any technical knowledge — just describe what happened in your own words. The process takes about 5–10 minutes.',
  },
  {
    q: 'How can I track my complaint?',
    a: 'Go to "Track Complaint" and enter your Complaint ID (e.g. CCP-2026-104382). You\'ll see the current status, a timeline of progress, and the latest update from the investigating authority. You can also track from your dashboard if you are logged in.',
  },
  {
    q: 'What evidence should I provide?',
    a: 'Provide any screenshots, transaction receipts, email/chat screenshots, or documents related to the incident. Evidence significantly strengthens your complaint. Common evidence includes: screenshots of fraudulent messages, UPI transaction IDs, bank statements, emails from the fraudster, and fake website URLs.',
  },
  {
    q: 'What should I do immediately after financial fraud?',
    a: 'Act quickly:\n1. Call the National Cybercrime Helpline: 1930 immediately.\n2. Call your bank\'s 24/7 helpline and freeze/block your account/card.\n3. Note down all transaction IDs, dates and amounts.\n4. Do NOT attempt to contact the fraudster again.\n5. File a complaint here on this portal with all details.\nThe faster you report, the higher the chance of recovering your money.',
  },
  {
    q: 'How can I avoid phishing scams?',
    a: 'Never click links in unexpected SMS, WhatsApp, or emails. Always type bank/government URLs directly into your browser. Check if the website address starts with "https://" and matches the official domain. Legitimate banks and government agencies will never ask for your OTP, PIN, or full password. Visit the Safety Centre for detailed guidance.',
  },
  {
    q: 'How do I update my contact information?',
    a: 'Log in and go to your Profile page. Click "Edit" to update your name, email, mobile number, and preferred communication method. Changes are saved immediately. Make sure your contact details are current so that investigating authorities can reach you.',
  },
  {
    q: 'Is my personal information safe?',
    a: 'Yes. All data is encrypted using AES-256. Your personal information is only accessible to authorized investigating officers. We never share your data with third parties. The portal follows strict data protection and privacy guidelines under applicable Indian law.',
  },
  {
    q: 'How long does it take for a complaint to be resolved?',
    a: 'Resolution time varies depending on the complexity of the case. Typically:\n• Initial review: within 24–48 hours\n• Assignment to authority: within 3–5 working days\n• Investigation: depends on case complexity\nYou will be notified at every stage. Use the Track Complaint feature to check current status.',
  },
  {
    q: 'Can I report anonymously?',
    a: 'While you are encouraged to provide your contact details so authorities can follow up, you can report with minimal personal information. However, providing accurate contact details significantly improves the chances of investigation and recovery.',
  },
  {
    q: 'What types of cybercrime can I report here?',
    a: 'You can report: Online financial fraud, UPI/payment fraud, phishing, social media fraud, identity theft, cyber harassment, account hacking, fake websites/apps, investment scams, job scams, and other cybercrimes. If you are unsure which category applies, select "Other" and describe the incident.',
  },
];

export default function Help() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle size={20} color="#1e3a6e"/>
          <h1 className="text-2xl font-black text-slate-900">Help & Support</h1>
        </div>
        <p className="text-slate-500 text-sm">Find answers to common questions about using the CyberPulse Citizen Portal.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* FAQ Section */}
        <div className="lg:col-span-2">
          <h2 className="font-bold text-slate-800 text-lg mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="card overflow-hidden">
                <button
                  id={`faq-${i}`}
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-answer-${i}`}>
                  <span className="font-semibold text-slate-800 text-sm pr-4">{faq.q}</span>
                  {openIndex === i
                    ? <ChevronUp size={16} color="#64748b" className="flex-shrink-0"/>
                    : <ChevronDown size={16} color="#64748b" className="flex-shrink-0"/>
                  }
                </button>
                {openIndex === i && (
                  <div id={`faq-answer-${i}`} className="px-5 pb-5 animate-fade-in">
                    <div className="border-t border-slate-100 pt-4">
                      {faq.a.split('\n').map((line, j) => (
                        <p key={j} className="text-sm text-slate-700 leading-relaxed mb-1 last:mb-0">{line}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Sidebar */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MessageCircle size={16} color="#1e3a6e"/> Need More Help?
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, #fef2f2, #fff)', border: '1px solid #fecaca' }}>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cybercrime Helpline</p>
                <p className="text-4xl font-black text-red-700">1930</p>
                <p className="text-xs text-slate-500 mt-1">24/7 · Toll Free</p>
              </div>

              {[
                { icon: <Phone size={15} color="#1e3a6e"/>, label: 'National Emergency', value: '112' },
                { icon: <Phone size={15} color="#1e3a6e"/>, label: 'Police', value: '100' },
                { icon: <Mail size={15} color="#1e3a6e"/>, label: 'Email Support', value: 'help@cyberpulse.gov.in' },
                { icon: <ExternalLink size={15} color="#1e3a6e"/>, label: 'Official Portal', value: 'cybercrime.gov.in' },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#f0f4ff' }}>
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{c.label}</p>
                    <p className="text-sm font-semibold text-slate-800">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5" style={{ background: 'linear-gradient(135deg, #f0f4ff, #e8efff)' }}>
            <h3 className="font-bold text-slate-800 mb-2 text-sm">🛡️ Safety Resources</h3>
            <ul className="space-y-2">
              {[
                { label: 'Safety Centre', href: '/safety-centre' },
                { label: 'Cyber Safety Map', href: '/safety-map' },
                { label: 'Latest Alerts', href: '/alerts' },
                { label: 'Report Cybercrime', href: '/report' },
              ].map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors flex items-center gap-1">
                    → {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5 text-center">
            <p className="text-xs text-slate-500 leading-relaxed">
              This is a prototype demonstration. In production, this section would connect to live support channels and ticketing systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
