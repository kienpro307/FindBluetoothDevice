/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import Backend from 'i18next-http-backend';
import RNLanguageDetector from '@os-team/i18next-react-native-language-detector';
import { LANGUAGE_RESOURCE } from '../app/constant';

i18n
  .use(RNLanguageDetector)
  .use(initReactI18next)
  .use(Backend)
  .init({
    compatibilityJSON: 'v3',
    // lng:'en',
    fallbackLng: 'en',
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    resources: LANGUAGE_RESOURCE,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
