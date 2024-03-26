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

import {Option} from '../../type';
import {dictionary2Trans} from '../../../app/utils/LanguageUtils';
import {DEVICE_IMAGES, OPTIONS} from '../../constant';
import CheckBox from '@react-native-community/checkbox';
import ScanContext from '../../context/ScanContext';
import NativeAdsShow from '../../ads/NativeAdsShow';

interface filterProps {
  navigation?: any;
  route?: any;
}

const Filter: React.FC<filterProps> = ({navigation, route}: filterProps) => {
  const {filterFor} = route.params;
  const {setFilterContext} = React.useContext(ScanContext);
  const {filter} = React.useContext(ScanContext);
  const [isSelectAll, setIsSelectAll] = React.useState(true);
  const [options, setOptions] = React.useState<Option[]>(OPTIONS);
  const allOptionList = [
    'pc',
    'phone',
    'health',
    'wearable',
    'headphone',
    'speaker',
    'peripheral',
    'unknown',
  ];

  const handelCLickAll = (selectAll: boolean) => {
    const allOptions = options.map(option => ({
      ...option,
      select: selectAll,
    }));

    setOptions(allOptions);
    setFilterContext(filterFor, allOptionList);
  };

  const handelCLickFilter = () => {
    const selectedFilters = options.filter(option => option.select);
    const selectedTitles = selectedFilters.map(filter => filter.nameDevice);
    // console.log('Selected Filters:', selectedTitles);
    setFilterContext(filterFor, selectedTitles);
    navigation.navigate(filterFor);
  };

  const toggleOption = (index: number) => {
    const newOptions = [...options];
    newOptions[index].select = !newOptions[index].select;
    setOptions(newOptions);
  };

  const toggleAllOption = () => {
    handelCLickAll(!isSelectAll);
    setIsSelectAll(!isSelectAll);
  };

  const renderOption = (item: Option, index: number) => (
    <TouchableOpacity
      style={styles.optionBar}
      onPress={() => toggleOption(index)}>
      <View style={[styles.optionBar, {flex: 1}]}>
        <Image
          style={styles.deviceicon}
          resizeMode="cover"
          source={item.image}
        />
        <Text style={{color: Color.colorDeepskyblue, fontWeight: '500'}}>
          {dictionary2Trans(item.title)}
        </Text>
      </View>

      <CheckBox
        disabled={false}
        value={item.select}
        onValueChange={() => toggleOption(index)}
        tintColors={{
          true: Color.colorDeepskyblue,
          false: Color.colorDeepskyblue,
        }}
        // style={{flex: 1}}
      />
    </TouchableOpacity>
  );
  const fetchData = () => {
    const selectFilter = filter.find(f => f.type === filterFor);
    if (selectFilter) {
      setOptions(oldOptions => {
        const updatedOptions = oldOptions.map(option => {
          const isSelected = selectFilter.options.includes(option.nameDevice);
          return {...option, select: isSelected};
        });
        return updatedOptions;
      });
    } else {
      setFilterContext(filterFor, allOptionList);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [filterFor]);

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
            <Text style={styles.scanDevices}>{dictionary2Trans('Filter')}</Text>
          </View>
          <View style={{width: 40, height: 40}} />
        </View>
      </LinearGradient>
      <TouchableOpacity
        style={[
          styles.optionBar,
          {width: wp('90%'), justifyContent: 'flex-end', marginVertical: 5},
        ]}
        onPress={() => toggleAllOption()}>
        <View style={[styles.optionBar]}>
          <Text style={{color: Color.colorDeepskyblue, fontWeight: '500'}}>
            {dictionary2Trans('Select All')}
          </Text>
        </View>

        <CheckBox
          disabled={false}
          value={isSelectAll}
          onValueChange={() => toggleAllOption()}
          tintColors={{
            true: Color.colorDeepskyblue,
            false: Color.colorDeepskyblue,
          }}
          // style={{flex: 1}}
        />
      </TouchableOpacity>
      <FlatList<Option>
        data={options}
        renderItem={({item, index}) => renderOption(item, index)}
        keyExtractor={(item, index) => index.toString()}
        style={styles.foundeddevices}
      />
      <View style={[styles.adNative]}>
        <NativeAdsShow size="small" repository="simple" />
      </View>
      <View style={styles.ActionBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handelCLickFilter()}>
          <Text style={styles.actionTextButton}>
            {dictionary2Trans('Apply Filter')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* <View style={styles.ad}>
        <BannerAdWrap size={BannerAdSize.BANNER} position="bottom" />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  optionBar: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  actionTextButton: {color: 'white', fontWeight: '500'},
  actionButton: {
    marginHorizontal: 10,
    paddingHorizontal: 25,
    paddingVertical: 10,
    backgroundColor: 'blue',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  ActionBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  adNative: {
    width: '95%',
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'column',                                                                                                     
    overflow: 'hidden',
  },
  deviceicon: {
    width: 35,
    height: 35,
    marginRight: 10,
  },

  foundeddevices: {
    width: wp('90%'),
    paddingBottom: 100,
    // margin: 20,
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
  ad: {
    // backgroundColor: Color.colorLightgray,
    height: 50,
    bottom: 0,
    overflow: 'hidden',
    width: '100%',
    left: 0,
    position: 'absolute',
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

export default Filter;
