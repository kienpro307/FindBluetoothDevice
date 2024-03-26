import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import {dictionary2Trans} from '../../utils/LanguageUtils';
import {COLOR, DEVICE_IMAGES, STORAGE} from '../../constant';
import StarRateIcon from '../../icons/RateIcon';
import DirectIcon from '../../icons/DirectIcon';
import Rate, {AndroidMarket} from 'react-native-rate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Color} from '../../GlobalStyles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useAppContext} from '../../context/AppContext';

interface ModalRateAppProps {
  open: boolean;
}

const Star = ({active, onPress}: {active: boolean; onPress: () => void}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: wp('13%'),
        width: wp('13%'),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active ? Color.colorPowderblue : '#dbdbdb',
        borderRadius: 100,
      }}>
      {active ? (
        <StarRateIcon
          height={wp('8%')}
          width={wp('8%')}
          fill={Color.colorBlue}
        />
      ) : (
        <StarRateIcon height={wp('8%')} width={wp('8%')} fill={'#fff'} />
      )}
    </TouchableOpacity>
  );
};

const ModalRateApp = (props: ModalRateAppProps) => {
  const {setOpenRatingModal} = useAppContext();
  const [rate, setRate] = React.useState<number>(4);
  const [showResponse, setShowResponse] = React.useState<boolean>(false);

  const onRate = () => {
    if (rate >= 4) {
      const options = {
        GooglePackageName: 'com.flabs.find.my.devices',
        preferredAndroidMarket: AndroidMarket.Google,
        preferInApp: true,
        openAppStoreIfInAppFails: true,
      };
      Rate.rate(options, (success, errorMessage) => {
        setShowResponse(true);
        if (success) {
        }
        if (errorMessage) {
        }
      });
    } else {
      setTimeout(() => {
        setShowResponse(true);
      }, 500);
    }
  };

  React.useEffect(() => {
    if (props.open) {
      AsyncStorage.setItem(STORAGE.LAST_SHOW_RATE, Date.now().toString());
    }
  }, [props.open]);

  const onClose = () => {
    setShowResponse(false);
    setRate(4);
    setOpenRatingModal(false);
  };

  return (
    <Modal
      transparent
      visible={props.open}
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.container} onTouchEnd={onClose}>
        <View
          onTouchEnd={e => e.stopPropagation()}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            backgroundColor: '#F8FAFF',
            borderRadius: 20,
            gap: 20,
            maxWidth: 330,
            width: '90%',
          }}>
          {showResponse ? (
            <>
              <View style={{alignItems: 'center'}}>
                <Image
                  style={{height: 150}}
                  resizeMode="contain"
                  source={DEVICE_IMAGES.rateApp}
                />
              </View>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: '#4f3529',
                  fontSize: 13,
                  textAlign: 'center',
                }}>
                {dictionary2Trans(
                  'Thank you and your feedback! To us, every feedback is valuable. We will constantly strive to improve service quality to increase your satisfaction.',
                )}
              </Text>
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    backgroundColor: Color.colorBlue,
                    alignItems: 'center',
                    paddingVertical: 10,
                    maxWidth: 300,
                    width: '100%',
                    borderRadius: 100,
                  }}>
                  <Text style={{fontFamily: 'Poppins-Regular', color: '#fff'}}>
                    {dictionary2Trans('Ok')}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={{alignItems: 'center'}}>
                <Image
                  style={{height: 150}}
                  resizeMode="contain"
                  source={DEVICE_IMAGES.hardWork}
                />
              </View>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: '#4f3529',
                  fontSize: 13,
                  textAlign: 'center',
                }}>
                {dictionary2Trans(
                  "We are working hard for a better user experience. We'd greatly appreciate if you can rate us.",
                )}
              </Text>
              <View style={{alignItems: 'center'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    overflow: 'hidden',
                    gap: 8,
                    justifyContent: 'center',
                    width: '100%',
                  }}>
                  <Star onPress={() => setRate(1)} active={rate >= 1} />
                  <Star onPress={() => setRate(2)} active={rate >= 2} />
                  <Star onPress={() => setRate(3)} active={rate >= 3} />
                  <Star onPress={() => setRate(4)} active={rate >= 4} />
                  <Star onPress={() => setRate(5)} active={rate >= 5} />
                </View>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    gap: 10,
                    paddingRight: 25,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Italic',
                      fontSize: 12,
                      transform: [{translateY: 8}],
                      color: '#4f3529',
                    }}>
                    {dictionary2Trans('The best we can get')}
                  </Text>
                  <DirectIcon fill={'#4f3529'} height={30} width={30} />
                </View>
              </View>
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={onRate}
                  style={{
                    backgroundColor: Color.colorBlue,
                    alignItems: 'center',
                    paddingVertical: 10,
                    maxWidth: 300,
                    width: '100%',
                    borderRadius: 100,
                  }}>
                  <Text style={{fontFamily: 'Poppins-Regular', color: '#fff'}}>
                    {dictionary2Trans('Rate')}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ModalRateApp;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#00000090',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
