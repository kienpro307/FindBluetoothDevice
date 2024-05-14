/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  Switch,
  Share,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Color, FontFamily, FontSize} from '../../GlobalStyles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import BluetoothModule from '../../native.module.android/BluetoothModule';
import {
  dictionary2Trans,
  useLanguageChangeHook,
} from '../../utils/LanguageUtils';
import {useNavigation} from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import ScanContext from '../../context/ScanContext';
import {DEVICE_IMAGES, LANGUAGE, LANGUAGE_PREFERENCE} from '../../constant';
import {BannerAdSize} from 'react-native-google-mobile-ads';
import BannerAdWrap from '../../ads/BannerAdWrap';
import NativeAdsShow from '../../ads/NativeAdsShow';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import StorageModule from '../../native.module.android/StorageModule';
import ModalRateApp from '../../components/modals/ModalRate';
import {useAppContext} from '../../context/AppContext';
import DrawerMenu from '../../navigations/DrawerMenu';

const transparent = 'rgba(0,0,0,0.5)';

const MainScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {changeLanguage} = useLanguageChangeHook();
  const [openSetting, setOpenSetting] = React.useState(false);
  const {isBluetoothEnabled} = React.useContext(ScanContext);
  const {isLocationEnabled} = React.useContext(ScanContext);
  const [environmentVolume, setEnvironmentVolume] = useState(0);
  const [language, setLanguage] = useState<string>('');
  const {
    openRatingModal,
    openMenuModal,
    shareApp,
    openPolicy,
    setOpenMenuModal,
    setShareApp,
    setOpenPolicy,
    setOpenRatingModal,
  } = useAppContext();

  const handleEnvironmentVolumeChange = (value: number) => {
    setEnvironmentVolume(value);
  };

  const toggleBluetoothSwitch = () => {
    if (!isBluetoothEnabled) {
      BluetoothModule.turnOnBluetooth();
    } else {
      BluetoothModule.turnOffBluetooth();
    }
  };

  const toggleLocationSwitch = () => {
    if (!isLocationEnabled) {
      BluetoothModule.turnOnLocation();
    } else {
      BluetoothModule.turnOffLocation();
    }
  };

  const handleClickLanguageSetting = () => {
    setOpenSetting(false);
    navigation.navigate('languageSetting');
  };

  const handleClickDeviceList = () => {
    if (isBluetoothEnabled && isLocationEnabled) {
      navigation.navigate('PairedDevice');
    } else {
      setOpenSetting(true);
    }
  };

  const handleClickSetting = async () => {
    setOpenSetting(true);
    // navigation.navigate('Policy');
  };

  const handleClickScan = () => {
    if (isBluetoothEnabled && isLocationEnabled) {
      navigation.navigate('ScanningScreen');
    } else {
      setOpenSetting(true);
    }
  };

  const onShare = async () => {
    try {
      const appLink =
        'https://play.google.com/store/apps/details?id=com.flabs.find.my.devices';
      const translatedMessage = dictionary2Trans(
        "I found a super app to Screen Translation. Download it on Google Play:  '{{appLink}}'",
        appLink,
      ).props.children;

      const result = await Share.share({
        title: 'App link',
        message: translatedMessage,
        url: appLink,
      });
    } catch (error) {
      // Xử lý lỗi nếu cần
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const language = await StorageModule.getItem(LANGUAGE_PREFERENCE);
      if (language != '' && language != null) {
        setLanguage(language);
      } else {
        setLanguage('en');
      }
    };
    fetch();
  }, [changeLanguage]);

  useEffect(() => {
    if (openRatingModal || openMenuModal || shareApp || openPolicy) {
      setOpenMenuModal(false);
    }
  }, [openRatingModal, openMenuModal, shareApp, openPolicy]);

  useEffect(() => {
    if (shareApp) {
      setOpenMenuModal(false);
      onShare();
      setShareApp(false);
    }
  }, [shareApp]);

  // useEffect(() => {
  //   if (openPolicy) {
  //     setOpenMenuModal(false);
  //     navigation.navigate('Policy');
  //     setOpenPolicy(false);
  //   }
  // }, [openPolicy]);

  // useEffect(() => {
  //   if (openRatingModal) {
  //     setOpenMenuModal(false);
  //     onShare();
  //     setOpenRatingModal(false);
  //   }
  // }, [openRatingModal]);

  // useEffect(() => {
  //   if (shareApp) {
  //     setOpenMenuModal(false);
  //     onShare();
  //     setShareApp(false);
  //   }
  // }, [shareApp]);

  function settingModal(ads?: React.ReactNode) {
    return (
      <Modal
        statusBarTranslucent
        animationType="fade"
        onRequestClose={() => setOpenSetting(false)}
        visible={openSetting}
        transparent={true}>
        <View
          onTouchEnd={() => setOpenSetting(false)}
          style={styles.modalBlackBg}>
          <View onTouchEnd={e => e.stopPropagation()} style={styles.modalBg}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
              }}>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 40,
                  height: 60,
                }}></View>
              <Text style={styles.modalTextHeader}>
                {dictionary2Trans('Setting')}
              </Text>
              <TouchableOpacity
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: 40,
                  height: 60,
                }}
                onPress={() => setOpenSetting(false)}>
                <FontAwesomeIcon name="close" size={25} color={'red'} />
              </TouchableOpacity>
            </View>

            {!isBluetoothEnabled && isLocationEnabled && (
              <Text style={[styles.modalTextTurnOnYour, {color: 'red'}]}>
                {dictionary2Trans('please_turn_on_bluetooth')}
              </Text>
            )}
            {isBluetoothEnabled && !isLocationEnabled && (
              <Text style={[styles.modalTextTurnOnYour, {color: 'red'}]}>
                {dictionary2Trans('please_turn_on_location')}
              </Text>
            )}
            {!isBluetoothEnabled && !isLocationEnabled && (
              <Text style={[styles.modalTextTurnOnYour, {color: 'red'}]}>
                Please turn your Bluetooth and Location
              </Text>
            )}
            <View style={styles.modalBluetoothbar}>
              <Text style={styles.modalTextTurnOnYour}>
                {dictionary2Trans('turn_on_bluetooth')}
              </Text>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isBluetoothEnabled ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleBluetoothSwitch}
                value={isBluetoothEnabled}
              />
            </View>
            <View style={styles.modalBluetoothbar}>
              <Text style={styles.modalTextTurnOnYour}>
                {dictionary2Trans('turn_on_location')}
              </Text>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isLocationEnabled ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleLocationSwitch}
                value={isLocationEnabled}
              />
            </View>
            {/* <View style={[styles.modalSettingContainer, {marginTop: 40}]}>
              <View style={styles.modalSettingHeader}>
                <View style={{marginRight: 5}}>
                  <Image
                    style={styles.modalIcon}
                    resizeMode="cover"
                    source={DEVICE_IMAGES.blanket}
                  />
                </View>
                <Text style={styles.modalText}>
                  {dictionary2Trans('environment')}
                </Text>
              </View>

              <View style={styles.modalSettingBar}>
                <Slider
                  style={styles.modalSlider}
                  thumbTintColor="#f5dd4b"
                  maximumTrackTintColor="#C0C0C0"
                  minimumValue={0}
                  maximumValue={100}
                  step={1}
                  onValueChange={handleEnvironmentVolumeChange}
                  value={environmentVolume}
                />
                <Text style={styles.modalTextTurnOnYour}>
                  {environmentVolume}
                </Text>
              </View>
            </View> */}

            <View style={[styles.adNative]}>{ads}</View>
            {/* <TouchableOpacity
              onPress={() => handleClickLanguageSetting()}
              style={[styles.modalSettingHeader, {marginTop: 10}]}>
              <View style={{marginRight: 15}}>
                <FontAwesome6
                  name="earth-asia"
                  size={30}
                  color={Color.colorBlue}
                />
              </View>
              <View>
                <Text style={styles.modalText}>
                  {dictionary2Trans('Language')}
                </Text>
                {language && (
                  <Text style={styles.languageText}>
                    {LANGUAGE[language].nativeName}
                  </Text>
                )}
              </View>
            </TouchableOpacity> */}
            {/* <TouchableOpacity
              onPress={() => setOpenSetting(false)}
              style={styles.modalButton}>
              <Text style={styles.modalTextButton}>
                {dictionary2Trans('Save')}
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View style={styles.mainscreen}>
      <LinearGradient
        style={styles.navbar}
        locations={[0.51, 1]}
        colors={['#109bff', 'rgba(30, 160, 255, 0.6)']}
        useAngle={true}
        angle={180}>
        <View style={styles.action}>
          {/* <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={styles.menu}>
            <Image resizeMode="cover" source={DEVICE_IMAGES.menu} />
          </TouchableOpacity> */}
          {/* <TouchableOpacity style={styles.getpremiumbutton}>
            <Image resizeMode="cover" source={DEVICE_IMAGES.premium} />
            <Text style={[styles.getPremium, styles.scanTypo]}>
              {dictionary2Trans('get_premium')}
            </Text>
          </TouchableOpacity> */}
        </View>
        <View style={styles.title}>
          <Text style={styles.findMyDevices}>
            {dictionary2Trans('Find my Devices')}
          </Text>
          <Text style={styles.helpYouFind}>
            {dictionary2Trans('help_you_find')}
          </Text>
        </View>
      </LinearGradient>
      <View style={styles.landingPageContainer}>
        <Image
          style={{width: '70%', height: '70%', resizeMode: 'contain'}}
          source={DEVICE_IMAGES.landingPage}
        />
      </View>

      <View style={styles.actionbar}>
        <View style={styles.buttonframe}>
          <TouchableOpacity
            onPress={() => handleClickDeviceList()}
            style={[styles.buttonLeft, styles.buttonLayout]}>
            <Image
              style={styles.deviceListIcon}
              resizeMode="cover"
              source={DEVICE_IMAGES.buttonLeft}
            />
            <Text style={styles.buttonTypo}>
              {dictionary2Trans('paired_device')}
            </Text>
          </TouchableOpacity>
          <View style={styles.temp}></View>
          <TouchableOpacity
            onPress={() => handleClickSetting()}
            style={[styles.buttonRight, styles.buttonLayout]}>
            <Image
              style={styles.deviceListIcon}
              resizeMode="cover"
              source={DEVICE_IMAGES.setting}
            />
            <Text style={styles.buttonTypo}>{dictionary2Trans('Setting')}</Text>
          </TouchableOpacity>
        </View>
        <Image
          style={styles.scanbuttonLayout}
          resizeMode="cover"
          source={DEVICE_IMAGES.bgWhiteCircle}
        />
        <TouchableOpacity
          onPress={() => handleClickScan()}
          style={styles.scanbuttonLayout}>
          <Image
            style={styles.circlebuttonIcon}
            resizeMode="cover"
            source={DEVICE_IMAGES.scanButton}
          />
        </TouchableOpacity>
      </View>
      {settingModal(<NativeAdsShow size="small" repository="simple" />)}
      <View style={[styles.adNative]}>
        <NativeAdsShow size="small" repository="simple" />
      </View>
      {/* <View style={[styles.adBanner, {height: 60}]}></View> */}
      <View style={[styles.adBanner]}>
        <BannerAdWrap size={BannerAdSize.BANNER} position="bottom" />
      </View>
      <ModalRateApp open={openRatingModal} />
      {/* <DrawerMenu open={false} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  scanningContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    position: 'absolute',
    top: hp('15%'),
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
    justifyContent: 'space-between',
    backgroundColor: 'red',
    overflow: 'hidden',
    position: 'absolute',
    bottom: hp('12%'),
    zIndex: 1,
  },
  landingPageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  buttonLayout: {
    width: '38%',
    backgroundColor: Color.colorDeepskyblue,
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    paddingVertical: 7,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
  temp: {
    width: '26%',
    backgroundColor: Color.colorDeepskyblue,
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
  },
  buttonTypo: {
    color: Color.colorWhite,
    fontFamily: FontFamily.khulaSemiBold,
    fontWeight: '600',
    fontSize: 11,
    marginTop: 1,
  },
  scanbuttonLayout: {
    width: 98,
    height: 98,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanTypo: {
    fontFamily: FontFamily.khulaBold,
    fontWeight: '700',
    color: Color.colorWhite,
    fontSize: 12,
  },
  adNative: {
    width: '95%',
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    paddingBottom: 5,
  },
  adBanner: {},
  deviceListIcon: {
    width: 30,
    height: 30,
  },
  buttonLeft: {
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
  },
  buttonRight: {
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  buttonframe: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 61,
    width: '100%',
    justifyContent: 'space-between',
  },
  circlebuttonIcon: {
    width: 90,
    height: 90,
    position: 'absolute',
  },
  vectorIcon: {
    height: '46.97%',
    width: '23.48%',
  },
  scan: {
    fontFamily: FontFamily.khulaBold,
    fontWeight: '700',
  },
  actionbar: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: 273,
    height: 76,
    marginBottom: 50,
  },
  getPremium: {
    textAlign: 'right',
    fontFamily: FontFamily.khulaBold,
    fontWeight: '700',
    marginHorizontal: 3,
  },
  menu: {
    width: 30,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getpremiumbutton: {
    padding: 5,
    borderRadius: 10,
    borderColor: Color.colorWhite,
    borderWidth: 1.5,
    width: 'auto',
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  action: {
    marginTop: hp('3%'),
    // height: hp('7%'),
    height: hp('2%'),
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  findMyDevices: {
    fontSize: FontSize.size_lg_2,
    fontWeight: '800',
    fontFamily: FontFamily.khulaExtraBold,
    color: Color.colorWhite,
    textAlign: 'left',
  },
  helpYouFind: {
    color: Color.colorWhite,
    textAlign: 'left',
    fontFamily: FontFamily.khulaSemiBold,
    fontWeight: '600',
    fontSize: 13,
  },
  title: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    paddingHorizontal: 20,
  },
  navbar: {
    borderBottomRightRadius: 36,
    borderBottomLeftRadius: 36,
    height: hp('15%'),
    // height: hp('17%'),
    backgroundColor: 'transparent',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  mainscreen: {
    backgroundColor: Color.colorWhite,
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalBlackBg: {
    width: '100%',
    height: '100%',
    backgroundColor: '#00000090',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    flex: 1,
  },
  modalBg: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1,
  },
  modalBluetoothbar: {
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
    backgroundColor: Color.colorLightcyan,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 35,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  modalSettingBar: {
    width: '100%',
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
    paddingTop: 10,
  },
  modalSlider: {
    width: '70%',
    transform: [{scale: 1.5}],
  },
  modalSettingContainer: {
    marginVertical: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  modalSettingHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Color.colorPowderblue,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 10,
  },
  modalTextTurnOnYour: {
    fontSize: 12,
    color: Color.colorDarkslategray_100,
    fontFamily: FontFamily.khulaSemiBold,
    fontWeight: '600',
  },
  modalIcon: {width: 32, height: 32},
  modalTextHeader: {
    color: 'black',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  modalTextButton: {
    textAlign: 'center',
    color: Color.colorWhite,
    fontFamily: FontFamily.khulaBold,
    fontWeight: '700',
  },
  modalText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
  languageText: {
    color: 'black',
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.6,
  },
  modalButton: {
    borderWidth: 1,
    width: 80,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    marginTop: 10,
  },
});

export default MainScreen;
