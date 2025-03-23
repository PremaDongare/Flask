import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import all language files
import translationEN from './locales/en.json';
import translationHI from './locales/hi.json';
import translationTA from './locales/ta.json';
import translationTE from './locales/te.json';
import translationBN from './locales/bn.json';
import translationGU from './locales/gu.json';

// The translations
const resources = {
  en: {
    translation: translationEN
  },
  hi: {
    translation: translationHI
  },
  ta: {
    translation: translationTA
  },
  te: {
    translation: translationTE
  },
  bn: {
    translation: translationBN
  },
  gu: {
    translation: translationGU
  }
};

// Get saved language preference from localStorage or use browser language
const savedLanguage = localStorage.getItem('preferredLanguage');

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage || 'en',
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n; 