/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Color, FontFamily, FontSize} from '../../GlobalStyles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DeviceComponent from '../../components/DeviceComponent';
import ScanContext from '../../context/ScanContext';
import {BluetoothDeviceInfo} from '../../type';
import {dictionary2Trans} from '../../utils/LanguageUtils';
import IconReload from '../../icons/IconReload';
import {DEVICE_IMAGES} from '../../constant';
import {filterUtils} from '../../utils/FilterUtils';
import {useIsFocused} from '@react-navigation/native';
import BannerAdWrap from '../../ads/BannerAdWrap';
import {BannerAdSize} from 'react-native-google-mobile-ads';
import NativeAdsShow from '../../ads/NativeAdsShow';


const ScanScreen: React.FC = ({navigation}: any) => {
  const isFocused = useIsFocused();
  const filterFor = 'ScanScreen';
  const {listDevice, filter} =
    React.useContext(ScanContext);
  const [filterDevices, setFilterDevices] = React.useState<
    BluetoothDeviceInfo[]
  >([]);

  const renderDeviceItem = ({item}: {item: BluetoothDeviceInfo}) => (
    <DeviceComponent navigation={navigation} device={item} />
  );

  const handleReScan = () => {
    navigation.navigate('ScanningScreen');
  };

  const handleClickFilter = () => {
    navigation.navigate('filter', {filterFor: filterFor});
  };

  const fetchData = async () => {
    const selectFilter = filter.find(f => f.type === filterFor);
    // console.log('>>> selectFilter', selectFilter);
    if (!selectFilter) {
      // Nếu không có filter nào được chọn, trả về toàn bộ danh sách devices
      // console.log('there is no select filter');
      setFilterDevices(listDevice);
    } else {
      const devicesFilter = filterUtils(selectFilter.options, listDevice);
      // console.log('>>> devicesFilter', devicesFilter);
      setFilterDevices(devicesFilter);
    }
  };

  React.useEffect(() => {
    // console.log('im in use Effcet');
    fetchData();
  }, [isFocused]);

  return (
    <View style={styles.scanscreen}>
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
              {dictionary2Trans('Scan Devices')}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleReScan}
            style={{
              width: 40,
              height: 40,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
            }}>
            <IconReload style={{width: 22, aspectRatio: 1}} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <View style={styles.filterButtonBar}>
        <TouchableOpacity
          onPress={() => handleClickFilter()}
          style={[styles.filterbutton, styles.pairbuttonBg]}>
          <Image resizeMode="cover" source={DEVICE_IMAGES.filter} />
          <Text style={styles.filterTypo}>{dictionary2Trans('Filter')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.foundedDevicesTextContainer}>
        <Text style={styles.foundedDevicesText}>
          {dictionary2Trans('Founded Devices')}
        </Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignItems: 'center',
          // flex: 1,
        }}>
        <FlatList
          data={filterDevices}
          renderItem={renderDeviceItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.foundeddevices}
          horizontal={false}
        />
        <View style={[styles.adNative]}>
          <NativeAdsShow size="small" repository="simple" />
        </View>
      </View>
      {/* <View style={[styles.adNative]}>
        <NativeAdsShow size="small" repository="simple" />
      </View> */}
      <View style={styles.adBanner}>
        <BannerAdWrap size={BannerAdSize.BANNER} position="bottom" />
      </View>
      <View style={{height: 50}}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  pairbuttonBg: {
    backgroundColor: Color.colorDeepskyblue,
    overflow: 'hidden',
  },
  filterTypo: {
    fontSize: 13,
    textAlign: 'center',
    color: Color.colorWhite,
    fontFamily: FontFamily.khulaBold,
    fontWeight: '700',
  },
  frameFlexBox: {
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  foundeddevices: {
    width: wp('95%'),
    paddingBottom: 10,
  },
  foundedDevicesText: {
    color: Color.colorDarkslategray_200,
    fontFamily: FontFamily.khulaSemiBold,
    fontWeight: '600',
    fontSize: 12,
  },
  foundedDevicesTextContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 3,
  },
  filterbutton: {
    borderRadius: 12,
    width: 70,
    height: 35,
    paddingHorizontal: 10,
    margin: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    overflow: 'hidden',
    paddingVertical: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
  vectorIcon1: {
    width: 11,
    height: 18,
  },
  scanDevices: {
    fontSize: FontSize.size_lg_2,
    width: 147,
    height: 22,
    textAlign: 'center',
    color: Color.colorWhite,
    fontFamily: FontFamily.khulaBold,
    fontWeight: '700',
    marginTop: 20,
  },
  reScan: {
    height: 20,
    marginLeft: 30,
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
  filterButtonBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  adBanner: {
    // backgroundColor: Color.colorLightgray,
    height: 50,
    bottom: 0,
    overflow: 'hidden',
    width: '100%',
    left: 0,
    position: 'absolute',
  },
  adNative: {
    // width: '100%',
    // height: 120,
    // display: 'flex',
    // justifyContent: 'flex-end',
    // flexDirection: 'column',
    width: '95%',
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    paddingBottom: 5,
  },
  scanscreen: {
    borderRadius: 1,
    backgroundColor: Color.colorWhite,
    borderStyle: 'solid',
    borderColor: Color.colorGray,
    borderWidth: 0.3,
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  flatList: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  buttonRescan: {
    width: 100,
    height: 50,
    backgroundColor: '#109bff',
    position: 'absolute',
    bottom: 80,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default ScanScreen;
