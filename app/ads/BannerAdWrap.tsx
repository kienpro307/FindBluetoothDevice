/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {BannerAd, BannerAdProps, TestIds} from 'react-native-google-mobile-ads';
import {adjustSendEvent} from '../adjust/AdjustUtils';
import {ADJUST_EVENT, FIREBASE} from '../constant';
import {firebaseSendEvent} from '../firebase/FirebaseUtiils';
import AdsContext from './AdsContext';
import {BANNER_ID, getPlacementId} from './AdUtils';

interface BannerShowProps extends Omit<BannerAdProps, 'unitId'> {
  isTest?: boolean;
  position: 'bottom' | 'top';
  offset?: number;
  unitId?: string;
}

const BannerAdWrap = React.memo(
  ({
    isTest = false,
    position,
    unitId,
    offset = 0,
    onAdLoaded,
    ...rest
  }: BannerShowProps) => {
    const adContext = React.useContext(AdsContext);
    const onBannerLoaded = (dimensions: {width: number; height: number}) => {
      // adjustSendEvent(ADJUST_EVENT.BANNER_DISPLAYED);
      firebaseSendEvent(FIREBASE.BANNER_DISPLAYED);
      if (onAdLoaded) {
        onAdLoaded(dimensions);
      }
    };

    React.useEffect(() => {
      // adjustSendEvent(ADJUST_EVENT.BANNER_SHOW);
      firebaseSendEvent(FIREBASE.BANNER_SHOW);
    }, []);

    return (
      adContext.showAds && (
        <View
          style={[
            {
              alignItems: 'center',
              width: '100%',
            },
          ]}>
          <BannerAd
            // onPaid={payload => {
            //   console.log(payload);
            // }}
            onAdLoaded={onBannerLoaded}
            unitId={unitId || getPlacementId(TestIds.BANNER, BANNER_ID)}
            {...rest}
          />
        </View>
      )
    );
  },
  (pre: BannerShowProps, next: BannerShowProps) => {
    return JSON.stringify(pre) === JSON.stringify(next);
  },
);

export default BannerAdWrap;

const styles = StyleSheet.create({
  container: {},
});
