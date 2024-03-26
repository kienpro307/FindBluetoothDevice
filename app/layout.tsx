/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ScanContextProvider from './context/ScanContextProvider';
import {I18nextProvider} from 'react-i18next';
import i18next from '../services/i18next';
import StackNavigator from './navigations/StackNavigator';
import AdjustConfigProvider from './adjust/AdjustConfigProvider';
import {RemoteConfigProvider} from './remoteConfig/RemoteConfig';
import AdsContextProvider from './ads/AdsContextProvider';
import UpdateContextProvider from './forceUpdate/UpdateProvider';
import OpenApp from './screens/open/OpenApp';
import {AppProvider} from './context/AppContext';

export const Stack = createNativeStackNavigator();

const LayoutScreen = () => {
  return (
    <ScanContextProvider>
      {/* <AdjustConfigProvider> */}
      {/* <RemoteConfigProvider> */}
      <I18nextProvider i18n={i18next}>
        {/* <AdsContextProvider> */}
        <OpenApp>
          {/* <UpdateContextProvider> */}
          <AppProvider>
            <NavigationContainer>
              <StackNavigator />
            </NavigationContainer>
          </AppProvider>
          {/* </UpdateContextProvider> */}
        </OpenApp>
        {/* </AdsContextProvider> */}
      </I18nextProvider>
      {/* </RemoteConfigProvider> */}
      {/* </AdjustConfigProvidrer> */}
    </ScanContextProvider>
  );
};

export default LayoutScreen;
