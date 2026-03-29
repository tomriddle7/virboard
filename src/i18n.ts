import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ko from './locales/ko.json';
import en from './locales/en.json';
import ja from './locales/ja.json';

i18n
  .use(LanguageDetector) // 사용자 브라우저 언어 자동 감지
  .use(initReactI18next)
  .init({
    resources: {
      ko: { translation: ko },
      en: { translation: en },
      ja: { translation: ja }
    },
    fallbackLng: 'en', // 감지된 언어가 없을 때 기본 언어
    interpolation: {
      escapeValue: false, // React는 XSS를 자동 방지하므로 false
    },
  });

export default i18n;