
interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export const getLGPDConsent = (): CookieConsent | null => {
  const consent = localStorage.getItem('lgpd_consent');
  return consent ? JSON.parse(consent) : null;
};

export const setLGPDConsent = (consent: Omit<CookieConsent, 'timestamp'>): void => {
  const consentWithTimestamp: CookieConsent = {
    ...consent,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem('lgpd_consent', JSON.stringify(consentWithTimestamp));
};

export const hasLGPDConsent = (): boolean => {
  return getLGPDConsent() !== null;
};

export const clearPersonalData = (): void => {
  // Clear all personal data from localStorage
  const keysToKeep = ['lgpd_consent'];
  const allKeys = Object.keys(localStorage);
  
  allKeys.forEach(key => {
    if (!keysToKeep.includes(key)) {
      localStorage.removeItem(key);
    }
  });
};

export const anonymizeUserData = (data: any): any => {
  const sensitiveFields = ['email', 'telefone', 'cpf', 'endereco', 'nome'];
  const anonymized = { ...data };
  
  sensitiveFields.forEach(field => {
    if (anonymized[field]) {
      anonymized[field] = '[DADOS ANONIMIZADOS]';
    }
  });
  
  return anonymized;
};
