import {useTranslation, Trans} from 'react-i18next';
import StorageModule from '../native.module.android/StorageModule';
import {LANGUAGE_PREFERENCE} from '../constant';
import React from 'react';

export const useLanguageChangeHook = () => {
  const {i18n} = useTranslation();

  // i18n.changeLanguage('en');
  const changeLanguage = (value: string, isSave?: boolean) => {
    i18n
      .changeLanguage(value)
      .then(() => {
        if (isSave) {
          StorageModule.setItem(LANGUAGE_PREFERENCE, value);
        }
      })
      .catch(err => console.log(err));
  };

  return {changeLanguage};
};

export const useDictionaryToString = () => {
  const {t} = useTranslation();

  const dictionary2String = (key: string) => {
    return t(key);
  };
  return {dictionary2String};
};

export const dictionary2Trans = (key: string, defaultText?: string) => {
  return <Trans i18nKey={key}>{defaultText}</Trans>;
};
