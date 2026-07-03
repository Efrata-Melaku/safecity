import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Language } from '../types';

const translations = {
  en: {
    siteName: 'Safe City Hawassa',
    home: 'Home',
    about: 'About',
    howItWorks: 'How It Works',
    contacts: 'Emergency Contacts',
    report: 'Report Abuse',
    claimStatus: 'Check Claim Status',
    privacy: 'Privacy Policy',
    faq: 'FAQ',
    contact: 'Contact',
    adminLogin: 'Admin Login',
    emergencyExit: 'Emergency Exit',
    emergencyExitAmharic: 'ወዲያውኑ ውጣ',
    coverMode: 'Cover Mode',
    lowBandwidth: 'Low Bandwidth Mode',
    toggleLanguage: 'Switch to Amharic',
    pageTitle: 'Safe reporting for every resident',
    heroText: 'Report abuse safely, privately, and with support.',
    openReport: 'Open Report Wizard',
    learnMore: 'Learn More',
    submitReport: 'Submit Report',
    claimCode: 'Claim code',
    claimCodeHint: 'Use your claim code to check status anytime.',
    adminNotice: 'Temporary admin access is enabled for demonstration purposes.',
  },
  am: {
    siteName: 'Safe City Hawassa',
    home: 'መነሻ',
    about: 'ስለ እኛ',
    howItWorks: 'እንዴት ይሰራል',
    contacts: 'የአደጋ እውቂያዎች',
    report: 'ጥቃት ያስታውቁ',
    claimStatus: 'የማመልከቻ ሁኔታ ይመልከቱ',
    privacy: 'የግላዊነት ፖሊሲ',
    faq: 'ተደጋጋሚ ጥያቄዎች',
    contact: 'አግኙን',
    adminLogin: 'የአስተዳደር መግቢያ',
    emergencyExit: 'ወዲያውኑ ውጣ',
    emergencyExitAmharic: 'ወዲያውኑ ውጣ',
    coverMode: 'ሽፋን ሞድ',
    lowBandwidth: 'ዝቅተኛ ባንድዊድ ሞድ',
    toggleLanguage: 'ወደ እንግሊዝኛ ቀይር',
    pageTitle: 'ለእያንዳንዱ ነዋሪ ደህንነት ያለው ሪፖርት',
    heroText: 'ጥቃትን በደህንነት፣ በሚስጥር እና በድጋፍ ያስታውቁ።',
    openReport: 'የሪፖርት ጠቋሚ ክፈት',
    learnMore: 'ተጨማሪ ይመልከቱ',
    submitReport: 'ሪፖርት ያስገቡ',
    claimCode: 'የማመልከቻ ኮድ',
    claimCodeHint: 'የማመልከቻ ኮድዎን በማንኛውም ጊዜ ሁኔታ ለመመልከት ይጠቀሙ።',
    adminNotice: 'ለማሳያ የመግቢያ መስመር አስተዳደር ይገኛል።',
  },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (value: Language) => void;
  t: (key: keyof (typeof translations)['en']) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: keyof (typeof translations)['en']) => translations[language][key],
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
