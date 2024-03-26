/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect} from 'react';
import LayoutScreen from './app/layout';
import {SafeAreaView, StyleSheet} from 'react-native';
import ScanContextProvider from './app/context/ScanContextProvider';
import i18next from 'i18next';
import {LANGUAGE_PREFERENCE} from './app/constant';
import {useLanguageChangeHook} from './app/utils/LanguageUtils';
import StorageModule from './app/native.module.android/StorageModule';

i18next;
function App(): JSX.Element {
  const {changeLanguage} = useLanguageChangeHook();
  // set language
  useEffect(() => {
    const fetch = async () => {
      const language = await StorageModule.getItem(LANGUAGE_PREFERENCE);
      // const language = 'en';
      if (language != null) {
        changeLanguage(language);
      } else {
        changeLanguage('en');
      }
    };
    fetch();
  }, [changeLanguage]);

  return (
    <SafeAreaView style={styles.container}>
      <ScanContextProvider>
        <LayoutScreen />
      </ScanContextProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#fff',
  },
  wrap: {
    width: '100%',
    height: '100%',
  },
});

export default App;
