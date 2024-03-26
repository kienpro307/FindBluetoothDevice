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

import {dictionary2Trans} from '../../utils/LanguageUtils';
import {
  DEVICE_IMAGES,
  LANGUAGE_RESOURCE,
  LANGUAGE_TO_COUNTRY_CODE_MAP,
  LANGUAGE,
  LANGUAGE_PREFERENCE,
} from '../../constant';
import CountryFlag from 'react-native-country-flag';
import {useLanguageChangeHook} from '../../utils/LanguageUtils';
import StorageModule from '../../native.module.android/StorageModule';
import BannerAdWrap from '../../ads/BannerAdWrap';
import { BannerAdSize } from 'react-native-google-mobile-ads';

interface LanguageSettingProps {
  navigation?: any;
  route?: any;
}

const LanguageSetting: React.FC<LanguageSettingProps> = ({
  navigation,
  route,
}: LanguageSettingProps) => {
  const {changeLanguage} = useLanguageChangeHook();
  const [languageSellect, setLanguageSelect] = React.useState<string>('');

  const changeLng = (lng: string) => {
    changeLanguage(lng, true);
    navigation.goBack();
  };

  const renderLanguageItem = (item: string) => {
    const country = LANGUAGE_TO_COUNTRY_CODE_MAP[item];

    if (!country) {
      console.log('Error: Not found country code of ', item);
      return null;
    }

    return (
      <TouchableOpacity
        key={item}
        onPress={() => changeLng(item)}
        style={item === languageSellect ? styles.languageSellect : {}}>
        <View
          style={{
            paddingVertical: 15,
            paddingHorizontal: 20,
            flexDirection: 'row',
            gap: 15,
            alignItems: 'center',
          }}>
          <CountryFlag isoCode={country} size={25} />
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              color: Color.colorDarkslategray_100,
              fontSize: 20,
            }}>
            {LANGUAGE[item].nativeName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  React.useEffect(() => {
    const fetch = async () => {
      const language = await StorageModule.getItem(LANGUAGE_PREFERENCE);
      setLanguageSelect(language);
      // const language = 'en';
    };
    fetch();
  }, []);

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
            <Text style={styles.languageSetting}>
              {dictionary2Trans('Language Setting')}
            </Text>
          </View>
          <View style={{width: 40, height: 40}} />
        </View>
      </LinearGradient>
      <FlatList
        style={{width: '100%', flex: 1}}
        data={Object.keys(LANGUAGE_RESOURCE)}
        renderItem={({item}) => renderLanguageItem(item)}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              backgroundColor: 'grey',
              opacity: 0.2,
              marginHorizontal: 10,
            }}
          />
        )}
      />
      <View style={[styles.adBanner]}>
        <BannerAdWrap size={BannerAdSize.BANNER} position="bottom" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  vectorIcon1: {
    width: 11,
    height: 18,
  },
  languageSellect: {
    backgroundColor: Color.colorPowderblue,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  languageSetting: {
    fontSize: FontSize.size_lg_2,
    width: 147,
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
  adBanner: {},
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

export default LanguageSetting;
