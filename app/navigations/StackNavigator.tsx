/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// import HomeScreen from '../home/HomeScreen';
import DrawerNavigator from './DrawerNavigator';
import ScanScreen from '../screens/scanScreen/ScanResultsScreen';
import {SCREEN_OPTION_DEFAULT} from '../constant';
import DetectDevice from '../screens/detectDevice/DetectDevice';
import DeviceDetail from '../screens/deviceDetail/DeviceDetail';
import PairedDevice from '../screens/deviceList/PairedDevice';
import ScanResultsScreen from '../screens/scanScreen/ScanResultsScreen';
import ScanningScreen from '../screens/scanScreen/ScanningScreen';
import Filter from '../screens/filter/Filter';
import {useCommonApp} from '../CommonAppContext';
import {useOpenApp} from '../screens/open/OpenAppContext';
import {NativeEventEmitter} from 'react-native';
import LanguageSetting from '../screens/languageSetting/LanguageSetting';
import PolicyPreview from '../screens/policy/PolicyPreview';

const Stack = createNativeStackNavigator();

function StackNavigator() {

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="drawer"
          component={DrawerNavigator}
          options={SCREEN_OPTION_DEFAULT}
        />
        <Stack.Screen
          name="ScanScreen"
          component={ScanScreen}
          options={SCREEN_OPTION_DEFAULT}
        />
        <Stack.Screen
          name="languageSetting"
          component={LanguageSetting}
          options={SCREEN_OPTION_DEFAULT}
        />
        <Stack.Screen
          name="filter"
          component={Filter}
          options={SCREEN_OPTION_DEFAULT}
        />
        <Stack.Screen
          name="PairedDevice"
          component={PairedDevice}
          options={SCREEN_OPTION_DEFAULT}
        />
        <Stack.Screen
          name="DetectDevice"
          component={DetectDevice}
          options={SCREEN_OPTION_DEFAULT}
        />
        <Stack.Screen
          name="DeviceDetail"
          component={DeviceDetail}
          options={SCREEN_OPTION_DEFAULT}
        />
        <Stack.Screen
          name="ScanningScreen"
          component={ScanningScreen}
          options={SCREEN_OPTION_DEFAULT}
        />
        <Stack.Screen
          name="ScanResultsScreen"
          component={ScanResultsScreen}
          options={SCREEN_OPTION_DEFAULT}
        />
      </Stack.Navigator>
    </>
  );
}

export default StackNavigator;
