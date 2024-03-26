/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/self-closing-comp */
import React from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {dictionary2Trans, useDictionaryToString} from '../utils/LanguageUtils';
import {FontFamily} from '../GlobalStyles';
import {DEVICE_IMAGES} from '../constant';
import {useAppContext} from '../context/AppContext';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CustomDrawer = (props: any) => {
  const navigation = useNavigation<any>();
  const {dictionary2String} = useDictionaryToString();

  const {setOpenRatingModal, setShareApp} = useAppContext();
  const handleOpenRating = () => {
    setOpenRatingModal(true);
  };
  const handleShareApp = () => {
    setShareApp(true);
  };

  return (
    <DrawerContentScrollView {...props}>
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

      <View style={styles.drawerListWrapper}>
        <DrawerItemList {...props} />
        <DrawerItem
          icon={({focused, color, size}) => (
            <MaterialIcons name="star-rate" size={30} color={color} />
          )}
          label={dictionary2String('Rate App')}
          labelStyle={styles.label}
          onPress={() => handleOpenRating()}
        />
        <DrawerItem
          icon={({focused, color, size}) => (
            <Entypo name="share" size={30} color={color} />
          )}
          label={dictionary2String('Share App')}
          labelStyle={styles.label}
          onPress={() => handleShareApp()}
        />
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  drawerListWrapper: {
    // marginTop: 180,
  },
  image: {
    width: hp('8%'),
    height: hp('8%'),
    // position: 'absolute',
    // left: 120 - hp('4%'),
    // top: hp('5%'),
  },
  label: {marginLeft: -20, fontSize: 15},
  logoContainer: {display: 'flex', alignItems: 'center', top: 10},
  logoText: {
    fontWeight: '700',
    fontFamily: FontFamily.khulaExtraBold,
    color: 'white',
    textAlign: 'center',
    fontSize: 25,
  },
  navbar: {
    height: hp('25%'),
    maxHeight: 150,
    backgroundColor: 'transparent',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
