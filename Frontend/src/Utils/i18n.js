import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enLang from "../../locale/en/en.json";
import arLang from "../../locale/ar/ar.json";
// translation resources
const resources = {
  en: {
    translation: enLang,
  },
  ar: {
    translation: arLang,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    returnObjects: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "cookie", "navigator"], // 👈 where to check
      caches: ["localStorage"], // 👈 save in localStorage
    },
  });

export default i18n;
