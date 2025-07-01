"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { en } from './locales/en';
import { es } from './locales/es';
import { ca } from './locales/ca';

type Locale = 'en' | 'es' | 'ca';

const translations = { en, es, ca };

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to get nested keys like 'form.title'
function getNestedKey(obj: any, path: string): string {
  const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
  return typeof value === 'string' ? value : path;
}

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('es');

  useEffect(() => {
    document.documentElement.lang = translations[locale].htmlLang;
  }, [locale]);
  
  const t = (key: string): string => {
    return getNestedKey(translations[locale], key);
  };

  const contextValue = useMemo(() => ({
    locale,
    setLocale,
    t,
  }), [locale]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
