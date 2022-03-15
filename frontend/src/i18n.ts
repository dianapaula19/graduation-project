import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from "./locales/en/common.json";
import translationRO from "./locales/ro/common.json";

const resources = {
    en: {
        translation: translationEN
    },
    ro: {
        translation: translationRO
    }
}

i18n
  .use(initReactI18next) // bind react-i18next to the instance
  .init({
    resources,
    debug: true,
    lng: localStorage.getItem('language') as string,

    interpolation: {
      escapeValue: false, // not needed for react!!
    },

});

export default i18n;