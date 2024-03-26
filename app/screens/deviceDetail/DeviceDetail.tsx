/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Color, FontFamily, FontSize} from '../../GlobalStyles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation, useRoute} from '@react-navigation/native';
import {BluetoothDeviceInfo} from '../../type';
import {useState} from 'react';
import {dictionary2Trans} from '../../utils/LanguageUtils';
import {DEVICE_IMAGES} from '../../constant';
import {deviceDetailIcon, deviceTypeName} from '../../utils/IconDeviceUtils';
import BannerAdWrap from '../../ads/BannerAdWrap';
import {BannerAdSize} from 'react-native-google-mobile-ads';
import NativeAdsShow from '../../ads/NativeAdsShow';
import {useAds} from '../../ads/AdsContext';
import {useOpenApp} from '../open/OpenAppContext';

const DeviceDetail: React.FC = ({navigation}: any) => {
  const ad = useAds();
  const openApp = useOpenApp();
  const route = useRoute<any>();
  const [device, setDevice] = useState<BluetoothDeviceInfo | undefined>(
    undefined,
  );

  const handleClickDeviceDetectRange = () => {
    ad.showInter().then(() => {
      // console.log('Kết quả quảng cáo giữa nội dung:', result);
      navigation.navigate('DetectDevice', {item: device});
      openApp.onChangeShouldShowOpenAds(false);
    });
  };

  React.useEffect(() => {
    if (route.params && route.params.item !== undefined) {
      const item = route.params.item;
      setDevice(item);
      // console.log(item);
    }
  }, [route.params]);

  return (
    <View style={styles.deviceDetailScreen}>
      <LinearGradient
        style={styles.navbar}
        locations={[0.9, 1]}
        colors={['#109bff', 'rgba(30, 160, 255, 0.6)']}
        useAngle={true}
        angle={180}>
        <View style={styles.frame}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{width: 40, height: 40, justifyContent: 'flex-end'}}>
            <Image
              style={styles.vectorIcon1}
              resizeMode="cover"
              source={DEVICE_IMAGES.goBack}
            />
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.scanDevices}>
              {dictionary2Trans('Device Detail')}
            </Text>
          </View>
          <View style={{width: 40, height: 40}} />
        </View>
      </LinearGradient>
      <View style={{margin: 5}}>
        {device && (
          <Image
            style={styles.deviceicon}
            resizeMode="cover"
            source={deviceDetailIcon(device.deviceClass)}
          />
        )}
      </View>
      <View style={styles.deviceinfo}>
        <Text style={styles.tittle}>{dictionary2Trans('Device Name')}</Text>
        <Text style={styles.detail}>{device?.name}</Text>
        <Text style={styles.tittle}>{dictionary2Trans('Device Address')}</Text>
        <Text style={styles.detail}>{device?.address}</Text>
        <Text style={styles.tittle}>RSSI</Text>
        {device && (
          <Text style={styles.detail}>
            {device.rssi < -100 ? dictionary2Trans('Unknown') : device.rssi}
          </Text>
        )}

        <Text style={styles.tittle}>{dictionary2Trans('Device Type')}</Text>
        {device && (
          <Text style={styles.detail}>
            {dictionary2Trans(deviceTypeName(device.deviceClass))}
          </Text>
        )}
      </View>
      <View style={[styles.adNative]}>
        <NativeAdsShow size="small" repository="simple" />
      </View>
      <TouchableOpacity
        onPress={() => handleClickDeviceDetectRange()}
        style={styles.pairbutton}>
        <Text style={styles.pairTypo}>{dictionary2Trans('Find')}</Text>
      </TouchableOpacity>
      <View style={styles.ad}>
        <BannerAdWrap size={BannerAdSize.BANNER} position="bottom" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pairTypo: {
    fontSize: 16,
    color: Color.colorWhite,
    fontFamily: FontFamily.khulaBold,
    fontWeight: '700',
  },
  textTypo: {
    fontFamily: FontFamily.khulaRegular,
    fontSize: 11,
  },
  deviceinfoSpaceBlock: {
    marginTop: 6.67,
    paddingBottom: 3,
    paddingTop: 4,
    height: 40,
    backgroundColor: Color.colorLightcyan,
    width: 262,
    borderRadius: 15,
    overflow: 'hidden',
  },
  deviceLayout: {
    width: 171,
    height: 17,
    textAlign: 'left',
    color: Color.colorBlack,
  },
  adNative: {
    width: '90%',
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    paddingBottom: 5,
  },
  ad: {
    height: 50,
    bottom: 0,
    overflow: 'hidden',
    width: '100%',
    left: 0,
    position: 'absolute',
  },
  pairbutton: {
    backgroundColor: 'blue',
    width: wp('60%'),
    height: 45,
    justifyContent: 'center',
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
  tittle: {
    fontFamily: FontFamily.khulaSemiBold,
    fontWeight: '700',
    fontSize: 16,
    color: Color.colorBlack,
  },
  detail: {
    color: Color.colorBlack,
    fontFamily: FontFamily.khulaRegular,
    fontSize: 14,
    marginBottom: 10,
  },
  deviceinfo: {
    backgroundColor: Color.colorLightcyan,
    padding: 10,
    justifyContent: 'center',
    width: wp('80%'),
    borderRadius: 15,
    overflow: 'hidden',
  },
  deviceAdress: {
    fontFamily: FontFamily.khulaSemiBold,
    fontWeight: '600',
    fontSize: 12,
  },
  deviceicon: {
    borderRadius: 12,
    height: 40,
    width: 40,
  },
  vectorIcon1: {
    width: 11,
    height: 18,
  },
  scanDevices: {
    fontSize: FontSize.size_lg_2,
    color: Color.colorWhite,
    fontFamily: FontFamily.khulaBold,
    fontWeight: '700',
    marginTop: 20,
  },
  frame: {
    width: '100%',
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navbar: {
    borderBottomRightRadius: 21,
    borderBottomLeftRadius: 21,
    height: hp('13%'),
    backgroundColor: 'transparent',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  textContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceDetailScreen: {
    borderRadius: 1,
    backgroundColor: Color.colorWhite,
    borderStyle: 'solid',
    borderColor: Color.colorGray,
    borderWidth: 0.3,
    flex: 1,
    width: '100%',
    height: 672,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default DeviceDetail;
