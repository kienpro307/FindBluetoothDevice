/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  NativeEventEmitter,
  Dimensions,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {FontFamily, Color, FontSize, Border} from '../../GlobalStyles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {BluetoothDeviceInfo} from '../../type';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {rssi2Meter} from '../../utils/DistanceUtils';
import {DEVICE_IMAGES, MIN_VALUE} from '../../constant';
import BluetoothModule from '../../native.module.android/BluetoothModule';
import ScanContext from '../../context/ScanContext';
import {dictionary2Trans} from '../../utils/LanguageUtils';
import RNSpeedometer from '../../components/chart/speedometer';
import {deviceDetectIcon} from '../../utils/IconDeviceUtils';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {BannerAdSize} from 'react-native-google-mobile-ads';
import BannerAdWrap from '../../ads/BannerAdWrap';
import NativeAdsShow from '../../ads/NativeAdsShow';
// import {REMOTE_KEY, useRemote} from '../../remoteConfig/RemoteConfig';
import {useAds} from '../../ads/AdsContext';
import {firebaseSendEvent} from '../../firebase/FirebaseUtiils';
import {useOpenApp} from '../open/OpenAppContext';
import {REMOTE_KEY, useRemote} from '../../remoteConfig/RemoteConfig';

const windowWidth = Dimensions.get('window').width;
const transparent = 'rgba(0,0,0,0.5)';

const DetectDevice: React.FC = ({navigation}: any) => {
  // const numberReScanShowAds = useRemote(REMOTE_KEY.re_scan_number_free);
  const ads = useAds();
  const openAds = useOpenApp();
  const isFocused = useIsFocused();
  const {isScanning} = React.useContext(ScanContext);
  const route = useRoute<any>();
  const [device, setDevice] = React.useState<BluetoothDeviceInfo | undefined>(
    undefined,
  );
  const [listHistory, setListHistory] = React.useState<
    Array<{rssi: number; distance: string; time: number}>
  >([]);

  const [openModal, setOpenModal] = React.useState(false);
  const [checkHistory, setCheckHistory] = React.useState(false);
  const [lengthHistory, setLengthHistory] = React.useState(0);
  const [isNotFound, setIsNotFound] = React.useState(false);
  const [numberReScan, setNumberReScan] = React.useState<number>(1);
  const numberReScanShowAds = useRemote(REMOTE_KEY.re_scan_number_free);

  const handleFindDevice = (device: BluetoothDeviceInfo | undefined) => {
    setNumberReScan(numberReScan + 1);
    if (numberReScan % (numberReScanShowAds().asNumber() + 4) === 0) {
      ads.showInter().then(() => {
        if (device) BluetoothModule.findDevice(device);
        openAds.onChangeShouldShowOpenAds(false);
      });
    } else {
      if (device) BluetoothModule.findDevice(device);
    }
  };

  function renderModal(ads?: React.ReactNode) {
    return (
      <Modal
        statusBarTranslucent
        animationType="fade"
        visible={openModal}
        transparent={true}>
        <View
          onTouchEnd={() => setOpenModal(false)}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: transparent,
          }}>
          <View
            onTouchEnd={e => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              paddingHorizontal: 15,
              paddingBottom: 20,
              width: '90%',
              borderRadius: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxHeight: '60%',
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                }}></View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 40,
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 16,
                    fontWeight: '700',
                  }}>
                  {dictionary2Trans('History')}
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 40,
                  height: 40,
                  // backgroundColor: 'red',
                }}
                onPress={() => setOpenModal(false)}>
                <FontAwesomeIcon name="close" size={25} color={'red'} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {listHistory.map(item => renderItemsHistory(item))}
            </ScrollView>
            <View
              style={[styles.adNative, {width: '100%', paddingVertical: 0}]}>
              {ads}
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  function NotFoundModal() {
    return (
      <Modal visible={isNotFound} transparent={true}>
        <View
          onTouchEnd={() => setIsNotFound(false)}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: transparent,
          }}>
          <View
            onTouchEnd={e => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              padding: 15,
              width: '90%',
              borderRadius: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 15,
                fontWeight: '500',
                textAlign: 'center',
              }}>
              {dictionary2Trans("can't find device")}
            </Text>
            <TouchableOpacity
              onPress={() => setIsNotFound(false)}
              style={{
                borderWidth: 1,
                width: 80,
                height: 30,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'blue',
                marginTop: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: Color.colorWhite,
                  fontFamily: FontFamily.khulaBold,
                  fontWeight: '600',
                }}>
                {dictionary2Trans('confirm')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  React.useEffect(() => {
    if (route.params && route.params.item !== undefined) {
      const item = route.params.item;
      setDevice(item);
    }
  }, [route.params]);

  const add2History = (item: BluetoothDeviceInfo) => {
    const distanceValue = rssi2Meter(item ? item.rssi : MIN_VALUE);
    // console.log('distance value', distanceValue);
    setListHistory(old => [
      {
        rssi: item.rssi,
        distance: distanceValue > 5 ? '> 5m' : '\u2248 ' + distanceValue + 'm',
        time: item.lastDiscovered,
      },
      ...old,
    ]);
  };

  React.useEffect(() => {
    const eventEmitter = new NativeEventEmitter();
    const eventDeviceFoundListener = eventEmitter.addListener(
      'event_tracking_device',
      (data: BluetoothDeviceInfo) => {
        // console.log('tracking');
        // console.log(data);
        setDevice(data);
        add2History(data);
      },
    );
    return () => {
      eventDeviceFoundListener.remove();
    };
  }, []);

  React.useEffect(() => {
    if (isScanning && !checkHistory) {
      setCheckHistory(true);
    } else if (checkHistory) {
      setCheckHistory(false);
      if (listHistory.length === lengthHistory) {
        setIsNotFound(true);
      }
      setLengthHistory(listHistory.length);
    }
  }, [isScanning]);

  const renderItemsHistory = (item: any) => {
    const dateObject = new Date(parseInt(item.time));
    // Định dạng thời gian
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    });
    const formattedTime = timeFormatter.format(dateObject);

    // Định dạng ngày
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const formattedDate = dateFormatter.format(dateObject);

    return (
      <View
        key={item.time}
        style={{
          width: windowWidth * 0.8,
          height: 75,
          margin: 2,
          justifyContent: 'center',

          borderBottomWidth: 1, // Thêm đường kẻ ngăn cách
          borderBottomColor: 'grey', // Màu sắc của đường kẻ ngăn cách
        }}>
        <Text style={{color: 'black', fontSize: 16}}>RSSI: {item.rssi}</Text>
        <Text style={{color: 'black', fontSize: 16}}>
          {dictionary2Trans('Distance')}: {item.distance}
        </Text>
        <Text style={{color: 'black', fontSize: 16}}>
          {dictionary2Trans('Time')}: {formattedTime} {formattedDate}
        </Text>
      </View>
    );
  };

  React.useEffect(() => {
    if (route.params && route.params.item !== undefined) {
      const item = route.params.item;
      handleFindDevice(item);
      // console.log('>>> im find device: ', device);
    }
  }, [isFocused]);

  return (
    <View style={styles.detectDeviceScreen}>
      <LinearGradient
        style={styles.navbar}
        locations={[0.9, 1]}
        colors={['#109bff', 'rgba(30, 160, 255, 0.6)']}
        useAngle={true}
        angle={180}>
        <View style={styles.frame}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: 40,
              height: 40,
              justifyContent: 'flex-end',

              // backgroundColor: 'red',
            }}>
            <Image
              style={styles.vectorIcon1}
              resizeMode="cover"
              source={DEVICE_IMAGES.goBack}
            />
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.detectDevice}>
              {dictionary2Trans('Detect Device')}
            </Text>
          </View>
          <View style={{width: 40, height: 40}} />
        </View>
      </LinearGradient>

      <View style={styles.historyButtonBar}>
        <View style={styles.deviceinfo}>
          {device && (
            <Image
              style={styles.deviceinfoChild}
              resizeMode="cover"
              source={deviceDetectIcon(device.deviceClass)}
            />
          )}

          <View style={styles.deviceinfoText}>
            <Text style={styles.deviceName}>{device?.name}</Text>
            <Text style={styles.deviceDetail}>{device?.address}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => setOpenModal(true)}>
          <Image
            style={styles.historyIcon}
            resizeMode="cover"
            source={DEVICE_IMAGES.history}
          />
        </TouchableOpacity>
      </View>
      <View style={{display: 'flex', height: hp('29%')}}>
        <RNSpeedometer
          value={rssi2Meter(device ? device.rssi : MIN_VALUE)}
          minValue={0}
          size={wp('80%')}
        />
      </View>

      {/* <Text style={styles.distanceText}>{device?.rssi}</Text> */}
      <View style={{display: 'flex'}}>
        <Text style={styles.guideText}>
          {dictionary2Trans('go_around_to_update_distance')}
        </Text>
      </View>
      <View style={[styles.ad, styles.adLayout]} />
      <View style={[styles.adNative]}>
        <NativeAdsShow size="small" repository="simple" />
      </View>
      {isScanning ? (
        <TouchableOpacity style={styles.buttonFind}>
          <Text style={{color: 'white', fontSize: 20}}>
            {dictionary2Trans('Scanning...')}
          </Text>
          <ActivityIndicator
            color={'white'}
            size={30}
            style={{marginLeft: 5}}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.buttonFind}
          onPress={() => handleFindDevice(device)}>
          <Text style={{color: 'white', fontSize: 20}}>
            {dictionary2Trans('Re-Scan')}
          </Text>
        </TouchableOpacity>
      )}
      {renderModal(<NativeAdsShow size="small" repository="simple" />)}
      {NotFoundModal()}

      <View style={styles.ad}>
        <BannerAdWrap size={BannerAdSize.BANNER} position="bottom" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  adLayout: {
    width: 328,
    position: 'absolute',
    overflow: 'hidden',
  },
  amyLayout: {
    height: 17,
    width: 171,
    textAlign: 'left',
  },
  vectorIcon1: {
    width: 11,
    height: 18,
  },
  frame: {
    width: '100%',
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detectDevice: {
    fontSize: FontSize.size_lg_2,
    width: 147,
    height: 22,
    textAlign: 'center',
    color: Color.colorWhite,
    fontFamily: FontFamily.khulaBold,
    fontWeight: '700',
    marginTop: 20,
  },
  ad: {
    bottom: 0,
    height: 50,
    overflow: 'hidden',
    width: '100%',
    left: 0,
    position: 'absolute',
  },
  adNative: {
    // width: '90%',
    // bottom: 55,
    // overflow: 'hidden',
    // left: '5%',
    // position: 'absolute',
    // maxHeight: 150,
    width: '90%',
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    paddingVertical: 10,
  },
  distanceText: {
    fontSize: 46,
    color: Color.colorBlack,
    fontFamily: FontFamily.khulaBold,
    fontWeight: '700',
    marginTop: 20,
  },
  guideText: {
    fontSize: 15,
    color: Color.colorBlack,
    fontFamily: FontFamily.khulaBold,
    fontWeight: '400',
    marginHorizontal: 20,
    textAlign: 'center',
  },
  historyButtonBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  historyButton: {
    backgroundColor: Color.colorDeepskyblue,
    borderRadius: 11,
    overflow: 'visible',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    width: 40,
    height: 40,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 1,
  },
  historyIcon: {
    width: 30,
    height: 30,
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
  deviceinfoChild: {
    borderRadius: Border.br_3xs_1,
    width: 33,
    height: 33,
    overflow: 'hidden',
  },
  deviceName: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: FontFamily.khulaSemiBold,
    color: Color.colorBlack,
  },
  deviceDetail: {
    fontSize: 11,
    fontFamily: FontFamily.khulaRegular,
    marginTop: 2.73,
    color: Color.colorBlack,
  },
  deviceinfoText: {
    width: '100%',
    height: 36,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingRight: 8,
    marginLeft: 15,
    overflow: 'hidden',
  },
  deviceinfo: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: Color.colorLightcyan,
    height: 47,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 5,
    overflow: 'hidden',
    marginRight: 12,
  },
  detectDeviceScreen: {
    borderRadius: 1,
    backgroundColor: Color.colorWhite,
    borderStyle: 'solid',
    borderColor: Color.colorGray,
    borderWidth: 0.3,
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonFind: {
    borderWidth: 1,
    width: 200,
    height: 55,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    display: 'flex',
    flexDirection: 'row',
  },
});

export default DetectDevice;
