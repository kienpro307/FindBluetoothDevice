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
import BluetoothModule from '../../native.module.android/BluetoothModule';
import DeviceComponent from '../../components/DeviceComponent';
import {BluetoothDeviceInfo} from '../../type';
import {dictionary2Trans} from '../../../app/utils/LanguageUtils';
import {DEVICE_IMAGES} from '../../constant';
import ScanContext from '../../context/ScanContext';
import {filterUtils} from '../../utils/FilterUtils';
import {useIsFocused} from '@react-navigation/native';
import BannerAdWrap from '../../ads/BannerAdWrap';
import {BannerAdSize} from 'react-native-google-mobile-ads';
import NativeAdsShow from '../../ads/NativeAdsShow';

const PairedDevice: React.FC = ({navigation}: any) => {
  const isFocused = useIsFocused();
  const filterFor = 'PairedDevice';
  const {filter} = React.useContext(ScanContext);
  const [listBoundDevices, setListBondDevices] = React.useState<
    Array<BluetoothDeviceInfo>
  >([]);
  const [filterDevices, setFilterDevices] = React.useState<
    BluetoothDeviceInfo[]
  >([]);

  const fetchData = async () => {
    const results = await BluetoothModule.getListBondDevices();
    if (results != null) {
      setListBondDevices(results);
    }

    const selectFilter = filter.find(f => f.type === filterFor);
    // console.log('>>> selectFilter', selectFilter);
    if (!selectFilter) {
      // Nếu không có filter nào được chọn, trả về toàn bộ danh sách devices
      // console.log('there is no select filter');
      setFilterDevices(results);
    } else {
      const devicesFilter = filterUtils(selectFilter.options, results);
      // console.log('>>> devicesFilter', devicesFilter);
      setFilterDevices(devicesFilter);
    }
  };

  const renderDeviceItem = ({item}: {item: BluetoothDeviceInfo}) => (
    <DeviceComponent navigation={navigation} device={item} />
  );

  React.useEffect(() => {
    fetchData();
  }, [isFocused]);

  const handleClickFilter = () => {
    navigation.navigate('filter', {filterFor: filterFor});
  };

  return (
    <View style={styles.deviceListScreen}>
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
              {dictionary2Trans('Device List')}
            </Text>
          </View>
          <View style={{width: 40, height: 40}} />
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
          {dictionary2Trans('Coupled Devices')}
        </Text>
      </View>

      <View style={styles.deviceList}>
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
      <View style={styles.ad}>
        <BannerAdWrap size={BannerAdSize.BANNER} position="bottom" />
      </View>
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
  deviceicon: {
    width: 39,
    height: 39,
  },
  deviceList: {
    width: wp('100%'),
    alignItems: 'center',
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  foundeddevices: {
    width: wp('90%'),
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

    paddingVertical: 1,
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
    width: 'auto',
    height: 22,
    textAlign: 'center',
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
  filterButtonBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  ad: {
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
  deviceListScreen: {
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
});

export default PairedDevice;
