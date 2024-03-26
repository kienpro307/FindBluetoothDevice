import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  TouchableNativeFeedback,
} from 'react-native';
import {dictionary2Trans} from '../utils/LanguageUtils';
import Rate, {AndroidMarket} from 'react-native-rate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Color, FontFamily} from '../GlobalStyles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useAppContext} from '../context/AppContext';
import {COLORS, DEVICE_IMAGES} from '../constant';
import LinearGradient from 'react-native-linear-gradient';
import {ScrollView} from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';

interface DrawerMenuProps {
  open: boolean;
}
const DrawerItem = ({
  icon,
  title,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100%',
        gap: 10,
        backgroundColor: '#F8FAFF',
        paddingBottom: 20,
        paddingLeft: 20,
      }}>
      {icon}
      <Text
        style={{
          fontSize: 15,
          fontFamily: 'Poppins-SemiBold',
          color: Color.colorDarkslategray_200,
        }}>
        {dictionary2Trans(title)}
      </Text>
    </TouchableOpacity>
  );
};

const DrawerMenu = (props: DrawerMenuProps) => {
  const {setOpenMenuModal, setOpenRatingModal, setShareApp, setOpenPolicy} =
    useAppContext();

  const onClose = () => {
    setOpenMenuModal(false);
  };

  const handleOpenRating = () => {
    setOpenRatingModal(true);
  };

  const handleOpenShareApp = () => {
    setShareApp(true);
  };

  const handleOpenPolicy = () => {
    setOpenPolicy(true);
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
          style={styles.drawerContainer}>
          <LinearGradient
            style={styles.navbar}
            locations={[0.2, 1]}
            colors={['rgba(0, 137, 216, 1)', '#0089D8']}
            useAngle={true}
            angle={180}>
            <Image source={DEVICE_IMAGES.logo} style={styles.image} />
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>
                {dictionary2Trans('Find my Devices')}
              </Text>
            </View>
          </LinearGradient>
          <ScrollView style={styles.drawerListItem}>
            <DrawerItem
              icon={
                <MaterialIcons
                  name="star-rate"
                  size={30}
                  color={Color.colorDarkslategray_200}
                />
              }
              title="Rate App"
              onPress={handleOpenRating}
            />
            <DrawerItem
              icon={
                <Entypo
                  name="share"
                  size={30}
                  color={Color.colorDarkslategray_200}
                />
              }
              title="Share App"
              onPress={handleOpenShareApp}
            />
            <DrawerItem
              icon={
                <MaterialIcons
                  name="policy"
                  size={30}
                  color={Color.colorDarkslategray_200}
                />
              }
              title="Privacy policy"
              onPress={handleOpenPolicy}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default DrawerMenu;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#00000090',
    justifyContent: 'flex-start',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  drawerContainer: {
    backgroundColor: '#F8FAFF',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    width: '80%',
    maxWidth: 300,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  drawerListItem: {
    paddingTop: 20,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  image: {
    width: hp('8%'),
    height: hp('8%'),
  },
  label: {marginLeft: -20},
  logoContainer: {display: 'flex', alignItems: 'center', top: 10},
  logoText: {
    fontWeight: '700',
    fontFamily: FontFamily.khulaExtraBold,
    color: 'white',
    textAlign: 'center',
    fontSize: 25,
  },
  navbar: {
    paddingTop: 20,
    height: hp('25%'),
    maxHeight: 180,
    backgroundColor: 'transparent',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
