/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {COLORS} from '../constant';
import CustomDrawer from './CustomDrawer';
import MainScreen from '../screens/mainScreen/MainScreen';
import PairedDevice from '../screens/deviceList/PairedDevice';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import PolicyPreview from '../screens/policy/PolicyPreview';
import {useDictionaryToString} from '../utils/LanguageUtils';
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const {dictionary2String} = useDictionaryToString();
  return (
    <>
      <Drawer.Navigator
        drawerContent={props => <CustomDrawer {...props} />}
        screenOptions={{
          headerShown: false,
          drawerActiveBackgroundColor: COLORS.BACK_GROUND,
          drawerActiveTintColor: COLORS.white,
          drawerLabelStyle: {
            marginLeft: -20,
            fontSize: 15,
          },
        }}
        initialRouteName="MainScreen">
        <Drawer.Screen
          name={dictionary2String('Home')}
          component={MainScreen}
          options={{
            title: dictionary2String('Home'),
            drawerIcon: ({focused, color, size}) => (
              <Entypo name="home" size={30} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name={dictionary2String('Policy')}
          component={PolicyPreview}
          options={{
            title: dictionary2String('Privacy Policy'),
            headerShown: false,
            drawerIcon: ({focused, color, size}) => (
              <MaterialIcons name="policy" size={30} color={color} />
            ),
          }}
        />

        {/* <Drawer.Screen
          name="Premium"
          component={PairedDevice}
          options={{
            title: 'Premium',
            drawerIcon: ({focused, color, size}) => (
              <FontAwesomeIcon5 name="crown" size={18} color={color} />
            ),
          }}
        /> */}
      </Drawer.Navigator>
    </>
  );
}

export default DrawerNavigator;
