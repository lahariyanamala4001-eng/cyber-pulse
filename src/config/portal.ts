export type PortalType = 'all' | 'citizen' | 'bank' | 'lea';

export const PORTAL_TYPE: PortalType = ((import.meta.env.VITE_PORTAL as string) || 'all').toLowerCase() as PortalType;

export const CITIZEN_PORTAL_URL = import.meta.env.VITE_CITIZEN_PORTAL_URL || '/';
export const BANK_PORTAL_URL = import.meta.env.VITE_BANK_PORTAL_URL || '/bank/login';
export const LEA_PORTAL_URL = import.meta.env.VITE_LEA_PORTAL_URL || '/lea/login';

export const isBankPortal = PORTAL_TYPE === 'bank';
export const isLEAPortal = PORTAL_TYPE === 'lea';
export const isCitizenPortal = PORTAL_TYPE === 'citizen';
export const isUnified = PORTAL_TYPE === 'all';