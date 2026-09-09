export interface SafetyLocation {
  id: string;
  name: string;
  type: 'police' | 'cybercell' | 'bank' | 'hospital' | 'assistance';
  lat: number;
  lng: number;
  address: string;
  phone: string;
  hours: string;
}

export const mockSafetyLocations: SafetyLocation[] = [
  {
    id: 'LOC-001',
    name: 'Cybercrime Police Station, Hyderabad',
    type: 'cybercell',
    lat: 17.3850,
    lng: 78.4867,
    address: 'Cyber Crime Police Station, CBI Colony, Banjara Hills, Hyderabad',
    phone: '040-27852020',
    hours: '24/7',
  },
  {
    id: 'LOC-002',
    name: 'Banjara Hills Police Station',
    type: 'police',
    lat: 17.4156,
    lng: 78.4347,
    address: 'Road No. 12, Banjara Hills, Hyderabad - 500034',
    phone: '040-23320000',
    hours: '24/7',
  },
  {
    id: 'LOC-003',
    name: 'Jubilee Hills Police Station',
    type: 'police',
    lat: 17.4324,
    lng: 78.4072,
    address: 'Road No. 45, Jubilee Hills, Hyderabad - 500033',
    phone: '040-23551234',
    hours: '24/7',
  },
  {
    id: 'LOC-004',
    name: 'State Bank of India, Secunderabad',
    type: 'bank',
    lat: 17.4399,
    lng: 78.4983,
    address: 'M.G. Road, Secunderabad, Hyderabad - 500003',
    phone: '1800-425-3800',
    hours: '9 AM – 4 PM (Mon–Sat)',
  },
  {
    id: 'LOC-005',
    name: 'HDFC Bank Cyber Fraud Help Desk',
    type: 'bank',
    lat: 17.3960,
    lng: 78.4753,
    address: 'Somajiguda, Hyderabad - 500082',
    phone: '1800-202-6161',
    hours: '24/7',
  },
  {
    id: 'LOC-006',
    name: 'Yashoda Hospitals',
    type: 'hospital',
    lat: 17.4482,
    lng: 78.3974,
    address: 'Raj Bhavan Road, Somajiguda, Hyderabad - 500082',
    phone: '040-45674567',
    hours: '24/7',
  },
  {
    id: 'LOC-007',
    name: 'Citizens Service Centre, Madhapur',
    type: 'assistance',
    lat: 17.4484,
    lng: 78.3908,
    address: 'HITEC City, Madhapur, Hyderabad - 500081',
    phone: '040-23120000',
    hours: '9 AM – 6 PM (Mon–Fri)',
  },
  {
    id: 'LOC-008',
    name: 'Cyber Crime Cell, Cyberabad',
    type: 'cybercell',
    lat: 17.4940,
    lng: 78.3996,
    address: 'Cyberabad Police Commissionerate, Madhapur, Hyderabad',
    phone: '040-23351669',
    hours: '10 AM – 5 PM (Mon–Sat)',
  },
  {
    id: 'LOC-009',
    name: 'Ameerpet Police Station',
    type: 'police',
    lat: 17.4375,
    lng: 78.4483,
    address: 'Ameerpet, Hyderabad - 500016',
    phone: '040-27660220',
    hours: '24/7',
  },
  {
    id: 'LOC-010',
    name: 'ICICI Bank, Hitech City',
    type: 'bank',
    lat: 17.4472,
    lng: 78.3770,
    address: 'Hitech City Main Road, Madhapur, Hyderabad - 500081',
    phone: '1800-1080',
    hours: '9 AM – 3:30 PM (Mon–Fri)',
  },
];
