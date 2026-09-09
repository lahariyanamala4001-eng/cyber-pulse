import { useState } from 'react';
import { ShieldCheck, CreditCard, Smartphone, Share2, Mail, Lock, UserCheck, TrendingUp, Briefcase, ChevronRight, X } from 'lucide-react';

interface SafetyTopic {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  tips: string[];
  warningSigns: string[];
}

const topics: SafetyTopic[] = [
  {
    id: 'banking',
    title: 'Online Banking Safety',
    category: 'Financial Security',
    icon: <CreditCard size={22}/>,
    color: '#1e3a6e',
    description: 'Protect your online banking accounts and financial information from cybercriminals.',
    tips: [
      'Always access your bank through the official website or app — never via links in emails or SMS.',
      'Enable two-factor authentication (2FA) for all banking apps.',
      'Set transaction alerts via SMS/email so you\'re notified of every transaction.',
      'Regularly review your bank statements and report suspicious activity immediately.',
      'Use strong, unique passwords for each banking account.',
      'Log out of banking sessions when done, especially on shared devices.',
    ],
    warningSigns: [
      'Calls or SMS asking you to verify your account details',
      'Requests for OTP from someone claiming to be bank staff',
      'Unexpected account debits or transfers',
      'Emails about password resets you didn\'t initiate',
    ],
  },
  {
    id: 'upi',
    title: 'UPI & Payment Safety',
    category: 'Payment Security',
    icon: <Smartphone size={22}/>,
    color: '#0369a1',
    description: 'Stay safe while using UPI, digital wallets, and online payment platforms.',
    tips: [
      'Never share your UPI PIN, OTP, or payment password with anyone — not even customer support.',
      'Verify the recipient\'s UPI ID carefully before every transaction.',
      'Be aware: accepting a UPI payment request does NOT require you to enter your PIN — if someone says it does, it\'s fraud.',
      'Avoid scanning QR codes sent by strangers for "receiving" money.',
      'Use official UPI apps from verified sources only.',
      'Enable the UPI app\'s PIN lock or biometric authentication.',
    ],
    warningSigns: [
      'Requests to scan a QR code to receive money',
      'SMS claiming you\'ve won a prize via UPI',
      'Calls asking you to enter your PIN to "verify" a transaction',
      'Unknown UPI collect requests appearing on your phone',
    ],
  },
  {
    id: 'social-media',
    title: 'Social Media Safety',
    category: 'Online Safety',
    icon: <Share2 size={22}/>,
    color: '#7c3aed',
    description: 'Protect your privacy and identity on social media platforms.',
    tips: [
      'Set your social media profiles to private. Limit who can see your posts and personal information.',
      'Never accept friend requests from strangers.',
      'Do not share personal details like phone numbers, addresses, or travel plans publicly.',
      'Enable login alerts so you\'re notified when someone logs into your account.',
      'Use unique, strong passwords for each social media account.',
      'Be cautious about clicking links shared in DMs or posts.',
    ],
    warningSigns: [
      'Unknown people messaging you with investment or job offers',
      'Duplicate profiles impersonating you or your contacts',
      'Requests for money or gift cards from social media "friends"',
      'Suspicious login alerts from unknown locations',
    ],
  },
  {
    id: 'phishing',
    title: 'Phishing Awareness',
    category: 'Fraud Prevention',
    icon: <Mail size={22}/>,
    color: '#dc2626',
    description: 'Learn to identify and avoid phishing emails, SMS and fake websites.',
    tips: [
      'Do not click links in unexpected emails or SMS messages — even if they appear to be from your bank.',
      'Check the sender\'s email address carefully — fraudsters use addresses like "noreply@bank-support.in".',
      'Look for spelling mistakes and urgent/threatening language in messages.',
      'Type website URLs directly into your browser rather than clicking links.',
      'Legitimate organizations will never ask for your password or OTP via email.',
      'Check for "HTTPS" and the padlock icon before entering any sensitive information.',
    ],
    warningSigns: [
      'Emails creating urgency: "Your account will be closed in 24 hours"',
      'Links with unusual domain names (e.g., "sbi-securepay.com")',
      'Requests for OTP, PIN, or Aadhaar details via email/SMS',
      'Messages claiming you\'ve won a lottery or prize',
    ],
  },
  {
    id: 'password',
    title: 'Password Security',
    category: 'Account Protection',
    icon: <Lock size={22}/>,
    color: '#166534',
    description: 'Create and manage strong passwords to protect all your online accounts.',
    tips: [
      'Use a password that is at least 12 characters long with a mix of letters, numbers, and symbols.',
      'Never reuse the same password across multiple accounts.',
      'Use a trusted password manager to store your passwords securely.',
      'Change passwords immediately if you suspect any account has been compromised.',
      'Enable two-factor authentication (2FA) wherever possible.',
      'Avoid using easily guessable passwords like your name, date of birth, or "password123".',
    ],
    warningSigns: [
      'Login notifications from devices or locations you don\'t recognise',
      'Emails about password changes you didn\'t make',
      'Account access denied even with the correct password',
    ],
  },
  {
    id: 'identity',
    title: 'Identity Protection',
    category: 'Personal Safety',
    icon: <UserCheck size={22}/>,
    color: '#92400e',
    description: 'Protect your personal identity and sensitive documents from misuse.',
    tips: [
      'Never share photos of your Aadhaar, PAN card, passport, or driving licence with unknown persons.',
      'Monitor your credit report regularly for unauthorized accounts or inquiries.',
      'Be cautious about KYC verification calls — banks do not ask for complete card numbers over the phone.',
      'Shred or destroy physical documents containing personal information before discarding.',
      'Use masked Aadhaar when sharing Aadhaar details online.',
      'Report lost/stolen identity documents to the police and relevant authorities immediately.',
    ],
    warningSigns: [
      'Receiving credit card statements for accounts you didn\'t open',
      'Calls from debt collectors about unknown loans',
      'Rejection of genuine credit applications due to existing loans you don\'t know about',
    ],
  },
  {
    id: 'investment',
    title: 'Investment Scam Awareness',
    category: 'Financial Fraud',
    icon: <TrendingUp size={22}/>,
    color: '#c2410c',
    description: 'Identify and avoid fraudulent investment and trading schemes.',
    tips: [
      'If an investment promises guaranteed high returns with no risk — it is almost certainly a scam.',
      'Verify whether the investment firm/app is registered with SEBI before investing.',
      'Be extremely cautious of "investment groups" on Telegram and WhatsApp.',
      'Never invest based solely on recommendations from strangers on social media.',
      'Do not make advance payments to "unlock" investment returns.',
      'Research thoroughly: visit the official SEBI website (sebi.gov.in) to check registration.',
    ],
    warningSigns: [
      'Promises of 5x or 10x returns within days',
      'Pressure to invest immediately before a "deadline"',
      'Requests to download unofficial trading apps',
      'WhatsApp/Telegram groups showing fake profit screenshots',
    ],
  },
  {
    id: 'job',
    title: 'Job Scam Awareness',
    category: 'Employment Fraud',
    icon: <Briefcase size={22}/>,
    color: '#0f766e',
    description: 'Protect yourself from fraudulent job offers and recruitment scams.',
    tips: [
      'Legitimate employers will never ask for money to process a job application.',
      'Verify the company\'s existence on the MCA website (mca.gov.in) before applying.',
      'Be wary of job offers arriving via WhatsApp from unknown numbers.',
      'Never share sensitive documents (Aadhaar, PAN, bank details) before signing an official offer letter.',
      'Research the company online: look for reviews, news, and official websites.',
      'Work-from-home jobs promising high pay for simple tasks (like watching videos) are almost always scams.',
    ],
    warningSigns: [
      'Jobs offering very high salaries for minimal work',
      'Requests for "registration fees" or "training fees"',
      'Job offers via WhatsApp with no formal interview process',
      'Vague job descriptions with no company name or contact address',
    ],
  },
];

export default function SafetyCentre() {
  const [selected, setSelected] = useState<SafetyTopic | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={20} color="#1e3a6e"/>
          <h1 className="text-2xl font-black text-slate-900">Safety Centre</h1>
        </div>
        <p className="text-slate-500 text-sm max-w-2xl">
          Learn how to protect yourself from common cyber threats. Select a topic below to get practical, easy-to-follow safety tips.
        </p>
      </div>

      {/* Topic Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {topics.map(topic => (
          <button key={topic.id} id={`safety-topic-${topic.id}`}
            onClick={() => setSelected(topic)}
            className="card p-5 text-left card-interactive group"
            style={{ borderTop: `3px solid ${topic.color}20` }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
              style={{ background: `${topic.color}12`, color: topic.color }}>
              {topic.icon}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: topic.color }}>
              {topic.category}
            </span>
            <h3 className="font-bold text-slate-800 text-sm leading-snug mb-2">{topic.title}</h3>
            <div className="flex items-center gap-1 text-xs font-semibold transition-colors" style={{ color: topic.color }}>
              Learn more <ChevronRight size={12}/>
            </div>
          </button>
        ))}
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="card p-6 sm:p-8 animate-fade-in-up" style={{ borderTop: `4px solid ${selected.color}` }}>
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${selected.color}12`, color: selected.color }}>
                {selected.icon}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: selected.color }}>
                  {selected.category}
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-0.5">{selected.title}</h2>
                <p className="text-sm text-slate-500 mt-1 max-w-xl">{selected.description}</p>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors flex-shrink-0">
              <X size={18}/>
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <ShieldCheck size={16} color={selected.color}/> Protection Tips
              </h3>
              <ul className="space-y-3">
                {selected.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white font-bold mt-0.5"
                      style={{ background: selected.color, fontSize: '10px' }}>{i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span className="text-red-500">⚠️</span> Warning Signs
              </h3>
              <ul className="space-y-2">
                {selected.warningSigns.map((sign, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700 p-3 rounded-xl"
                    style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                    <span className="text-red-500 flex-shrink-0 mt-0.5">✕</span>
                    {sign}
                  </li>
                ))}
              </ul>

              <div className="mt-5 p-4 rounded-xl" style={{ background: `${selected.color}08`, border: `1px solid ${selected.color}20` }}>
                <p className="text-sm font-semibold" style={{ color: selected.color }}>
                  🚨 If you have already been a victim:
                </p>
                <p className="text-sm text-slate-700 mt-1">
                  Report immediately at <strong>cybercrime.gov.in</strong> or call <strong>1930</strong>. The sooner you report, the better the chance of recovery.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* General notice */}
      {!selected && (
        <div className="card p-5 text-center" style={{ background: 'linear-gradient(135deg, #f0f4ff, #e8efff)' }}>
          <p className="text-sm text-slate-600">
            💡 Select any topic above to view detailed safety tips and warning signs.
          </p>
        </div>
      )}
    </div>
  );
}
