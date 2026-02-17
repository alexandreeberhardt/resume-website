import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import fr from './locales/fr/translation.json'
import en from './locales/en/translation.json'
import es from './locales/es/translation.json'
import de from './locales/de/translation.json'
import pt from './locales/pt/translation.json'
import it from './locales/it/translation.json'

const resources = {
  fr: { translation: fr },
  en: { translation: en },
  es: { translation: es },
  de: { translation: de },
  pt: { translation: pt },
  it: { translation: it },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['fr', 'en', 'es', 'de', 'pt', 'it'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
  })

export default i18n
