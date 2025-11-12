import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, currencies, Language, TranslationKey } from '../lib/translations';

interface LocaleContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currencyCode: string;
  setCurrencyCode: (code: string) => void;
  t: (key: TranslationKey) => string;
  formatCurrency: (amount: number) => string;
  getCurrencySymbol: () => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Detect user's locale
const detectUserLocale = (): { language: Language; currencyCode: string } => {
  const browserLang = navigator.language.split('-')[0];
  const supportedLanguages = Object.keys(translations);
  const language = (supportedLanguages.includes(browserLang) ? browserLang : 'en') as Language;
  
  // Try to detect currency from locale
  const fullLocale = navigator.language;
  const currencyMap: Record<string, string> = {
    'en-US': 'USD',
    'en-GB': 'GBP',
    'en-CA': 'CAD',
    'en-AU': 'AUD',
    'en-IN': 'INR',
    'es': 'EUR',
    'es-MX': 'MXN',
    'fr': 'EUR',
    'de': 'EUR',
    'zh': 'CNY',
    'ja': 'JPY',
    'pt': 'EUR',
    'pt-BR': 'BRL',
    'hi': 'INR',
    'ar': 'AED',
  };
  
  const currencyCode = currencyMap[fullLocale] || currencyMap[language] || 'USD';
  
  return { language, currencyCode };
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    if (saved && Object.keys(translations).includes(saved)) {
      return saved as Language;
    }
    return detectUserLocale().language;
  });
  
  const [currencyCode, setCurrencyCodeState] = useState<string>(() => {
    const saved = localStorage.getItem('currencyCode');
    if (saved) {
      return saved;
    }
    return detectUserLocale().currencyCode;
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('currencyCode', currencyCode);
  }, [currencyCode]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setCurrencyCode = (code: string) => {
    setCurrencyCodeState(code);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  const formatCurrency = (amount: number): string => {
    const currency = currencies.find(c => c.code === currencyCode);
    if (!currency) return `$${amount.toFixed(2)}`;

    try {
      return new Intl.NumberFormat(currency.locale, {
        style: 'currency',
        currency: currency.code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      // Fallback if Intl.NumberFormat fails
      return `${currency.symbol}${amount.toFixed(2)}`;
    }
  };

  const getCurrencySymbol = (): string => {
    const currency = currencies.find(c => c.code === currencyCode);
    return currency?.symbol || '$';
  };

  return (
    <LocaleContext.Provider
      value={{
        language,
        setLanguage,
        currencyCode,
        setCurrencyCode,
        t,
        formatCurrency,
        getCurrencySymbol,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
