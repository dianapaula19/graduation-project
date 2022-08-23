import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonEN from "./locales/en/common.json";
import formsEN from "./locales/en/forms.json";
import listsEN from "./locales/en/lists.json";
import pagesEN from "./locales/en/pages.json";
import sidenavEN from "./locales/en/sidenav.json";
import commonRO from "./locales/ro/common.json";
import formsRO from "./locales/ro/forms.json";
import listsRO from "./locales/ro/lists.json";
import pagesRO from "./locales/ro/pages.json";
import sidenavRO from "./locales/ro/sidenav.json";

const resources = {
  en: {
    common: commonEN,
    forms: formsEN,
    lists: listsEN,
    pages: pagesEN,
    sidenav: sidenavEN
  },
  ro: {
    common: commonRO,
    forms: formsRO,
    lists: listsRO,
    pages: pagesRO,
    sidenav: sidenavRO
  }
}

i18n
  .use(initReactI18next) // bind react-i18next to the instance
  .init({
    resources,
    debug: true,
    lng: localStorage.getItem('language') ? localStorage.getItem('language') as string : window.navigator.language,
    defaultNS: "common",
});

export default i18n;