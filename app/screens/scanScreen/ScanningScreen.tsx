/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState, useRef} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import {FontSize} from '../../GlobalStyles';
import {FontFamily} from '../../GlobalStyles';
import {Color} from '../../GlobalStyles';
import ScanContext from '../../context/ScanContext';
import BluetoothModule from '../../native.module.android/BluetoothModule';
import {BluetoothDeviceInfo} from '../../type';
import {useNavigation} from '@react-navigation/native';
import {dictionary2Trans} from '../../utils/LanguageUtils';
import {DEVICE_IMAGES} from '../../constant';
import {BannerAdSize} from 'react-native-google-mobile-ads';
import BannerAdWrap from '../../ads/BannerAdWrap';

const ScanningScreen = () => {
  const {listDevice} = React.useContext(ScanContext);
  const navigation = useNavigation<any>();

  const handleStopScan = () => {
    navigation.pop();
    navigation.navigate('ScanResultsScreen');
  };

  useEffect(() => {
    BluetoothModule.startScanAll();
    const timerToNavigate = setTimeout(() => {
      handleStopScan();
    }, 12000);
    return () => {
      BluetoothModule.stopScanAll();
      clearTimeout(timerToNavigate);
    };
  }, []);

  const renderItem = (item: BluetoothDeviceInfo, opacity: number) => {
    return (
      <View key={opacity} style={[styles.item, {opacity: opacity}]}>
        <Text style={{fontSize: 14, fontWeight: '500', color: 'black'}}>
          {item.name}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.scanningContainer}>
      <Text style={styles.scanningText}>{dictionary2Trans('scanning')}</Text>
      <Image style={{height: '65%'}} source={DEVICE_IMAGES.scanning} />
      <View style={{position: 'absolute', top: '55%'}}>
        {listDevice
          .slice(0, 5)
          .map((item, index) => renderItem(item, 1 - index / 5))}
      </View>
      <TouchableOpacity
        onPress={() => handleStopScan()}
        style={styles.scanningStop}>
        <Text
          style={{
            fontSize: FontSize.size_lg_2,
            fontWeight: '800',
            fontFamily: FontFamily.khulaExtraBold,
            color: Color.colorWhite,
          }}>
          {dictionary2Trans('stop_scan')}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          opacity: 0.2,
        }}
      />
      <View
        style={{
          width: '100%',
          height: 50,
          zIndex: 2,
          position: 'absolute',
          bottom: 0,
        }}>
        <BannerAdWrap size={BannerAdSize.BANNER} position="bottom" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scanningContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#204cfc',
    alignItems: 'center',
  },
  scanningText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    position: 'absolute',
    top: hp('7%'),
    zIndex: 1,
  },
  scanningStop: {
    borderRadius: 24,
    width: 160,
    height: 40,
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    overflow: 'hidden',
    position: 'absolute',
    bottom: hp('15%'),
    zIndex: 1,
  },
  item: {
    width: 200,
    height: 24,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    zIndex: 1,
    borderRadius: 10,
  },
});

export default ScanningScreen;
