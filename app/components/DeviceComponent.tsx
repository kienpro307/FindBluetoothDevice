/* eslint-disable prettier/prettier */
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Color, FontFamily, Border} from '../GlobalStyles';
import {BluetoothDeviceInfo} from '../type';
import {deviceIcon} from '../utils/IconDeviceUtils';
import {useOpenApp} from '../screens/open/OpenAppContext';
import {useAds} from '../ads/AdsContext';
import {useTranslation} from 'react-i18next';

interface DeviceProps {
  navigation: any; // hoặc kiểu chính xác của đối tượng navigation
  device: BluetoothDeviceInfo;
}

const DeviceComponent: React.FC<DeviceProps> = ({
  navigation,
  device,
}: DeviceProps) => {
  const {t} = useTranslation();
  const ad = useAds();
  const openApp = useOpenApp();

  const handleClickDeviceDetail = () => {
    navigation.navigate('DeviceDetail', {item: device});
  };
  const handleClickDeviceDetectRange = () => {
    ad.showInter().then(() => {
      // console.log('Kết quả quảng cáo giữa nội dung:', result);
      navigation.navigate('DetectDevice', {item: device});
      openApp.onChangeShouldShowOpenAds(false);
    });
  };

  return (
    <>
      <View style={styles.foundeddeviceLayout}>
        <TouchableOpacity
          onPress={() => handleClickDeviceDetail()}
          style={styles.deviceInfoButton}>
          <Image
            style={styles.deviceicon}
            resizeMode="cover"
            source={deviceIcon(device.deviceClass)}
          />
          <View style={styles.deviceinfo}>
            <Text style={styles.deviceName}>{device.name}</Text>
            <Text style={styles.deviceDetail}>{device.address}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleClickDeviceDetectRange()}
          style={[styles.pairbutton, styles.pairbuttonBg]}>
          <Text style={styles.pairPosition}>{t('Find')}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  foundeddeviceLayout: {
    height: 56,
    width: '100%',
    backgroundColor: Color.colorPowderblue,
    borderRadius: 15,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingRight: 10,
    marginBottom: 5,
  },
  deviceInfoButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    marginLeft: 10,
  },
  deviceinfo: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    flex: 1,
    paddingHorizontal: 10,
  },

  deviceicon: {
    width: 39,
    height: 39,
  },
  deviceName: {
    fontSize: 14,
    fontFamily: FontFamily.khulaSemiBold,
    fontWeight: '800',
    color: Color.colorDarkslategray_100,
  },
  deviceDetail: {
    fontSize: 12,
    fontFamily: FontFamily.khulaRegular,
    color: Color.colorDarkslategray_100,
    marginBottom: 7,
  },
  pairbutton: {
    borderRadius: Border.br_3xs_1,
    width: 48,
    height: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    paddingVertical: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
  pairbuttonBg: {
    backgroundColor: Color.colorDeepskyblue,
    shadowColor: '#000',
  },
  pairPosition: {
    color: Color.colorWhite,
    fontFamily: FontFamily.khulaBold,
    fontWeight: '700',
    fontSize: 12,
  },
});

export default DeviceComponent;
