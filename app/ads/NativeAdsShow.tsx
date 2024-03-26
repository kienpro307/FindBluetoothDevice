/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import NativeAdView from 'react-native-admob-native-ads';
import {
  AdBadge,
  TaglineView,
  HeadlineView,
  NativeMediaView,
  StoreView,
  IconView,
  CallToActionView,
  PriceView,
  StarRatingView,
} from 'react-native-admob-native-ads';
import AdsContext from './AdsContext';
// import {adjustSendEvent} from '../adjust/AdjustUtils';
import {ADJUST_EVENT, FIREBASE} from '../constant';
import {firebaseSendEvent} from '../firebase/FirebaseUtiils';

interface NativeAdsShowProps {
  repository?: string;
  adUnit?: string;
  size?: string;
}

const LayoutSmall = () => {
  return (
    <>
      <NativeMediaView
        style={{
          height: 100,
          width: '50%',
        }}
      />
      <AdBadge
        style={{
          width: 15,
          height: 15,
          borderWidth: 1,
          borderRadius: 2,
          borderColor: 'green',
        }}
        textStyle={{
          fontSize: 9,
          color: 'green',
        }}
      />

      <View style={{flex: 1, padding: 5}}>
        <HeadlineView
          style={{
            fontWeight: 'bold',
            fontSize: 12,
            color: '#000',
          }}
        />
        <TaglineView
          style={{
            fontWeight: '300',
            fontSize: 10,
            color: '#9e9e9e',
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              gap: 5,
              alignItems: 'center',
            }}>
            <StoreView
              style={{
                fontWeight: 'bold',
                fontSize: 10,
              }}
            />
            <StarRatingView size={12} iconSet="MaterialCommunityIcons" />
          </View>
        </View>
        <CallToActionView
          style={{
            height: 30,
            paddingHorizontal: 10,
            backgroundColor: '#388df5',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 100,
            elevation: 10,
            width: '100%',
          }}
          textStyle={{color: 'white', fontSize: 12}}
        />
      </View>
    </>
  );
};

const LayoutLarge = () => {
  return (
    <>
      <NativeMediaView
        style={{
          width: '100%',
          height: 130,
        }}
      />
      <AdBadge
        style={{
          width: 15,
          height: 15,
          borderWidth: 1,
          borderRadius: 2,
          borderColor: 'green',
        }}
        textStyle={{
          fontSize: 9,
          color: 'green',
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
          paddingHorizontal: 8,
        }}>
        <IconView
          style={{
            height: 50,
            width: 50,
          }}
        />
        <View style={{flex: 1}}>
          <HeadlineView
            style={{
              fontWeight: 'bold',
              fontSize: 14,
              color: '#000',
            }}
          />
          <TaglineView
            style={{
              fontWeight: '400',
              fontSize: 12,
              color: '#9e9e9e',
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                gap: 5,
                alignItems: 'center',
              }}>
              <StoreView
                style={{
                  fontWeight: 'bold',
                  fontSize: 10,
                }}
              />
              <StarRatingView size={12} iconSet="MaterialCommunityIcons" />
            </View>
            <PriceView
              style={{
                fontWeight: 'bold',
                fontSize: 10,
              }}
            />
          </View>
        </View>
      </View>

      <View style={{overflow: 'hidden', borderRadius: 50, margin: 4}}>
        <CallToActionView
          style={{
            height: 30,
            paddingHorizontal: 12,
            backgroundColor: '#388df5',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 100,
            elevation: 10,
            width: '100%',
          }}
          textStyle={{color: 'white', fontSize: 14}}
        />
      </View>
    </>
  );
};

const NativeAdsShow = (props: NativeAdsShowProps) => {
  const nativeAdViewRef = React.useRef<NativeAdView | null | undefined>();
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const adsContext = React.useContext(AdsContext);

  React.useEffect(() => {
    if (adsContext.showAds) {
      // console.log('adsContext.showAds', adsContext.showAds);
      nativeAdViewRef.current?.loadAd();
      // adjustSendEvent(ADJUST_EVENT.NATIVE_ADS_SHOW);
      firebaseSendEvent(FIREBASE.NATIVE_ADS_SHOW);
    }
  }, [adsContext.showAds]);
  // console.log('loaded', loaded);
  React.useEffect(() => {
    if (loaded && adsContext.showAds) {
      // console.log('loaded', loaded);
      // adjustSendEvent(ADJUST_EVENT.NATIVE_ADS_DISPLAYED);
      firebaseSendEvent(FIREBASE.NATIVE_ADS_DISPLAYED);
    }
  }, [loaded, adsContext.showAds]);

  return (
    adsContext.showAds && (
      <NativeAdView
        onNativeAdLoaded={() => {
          setLoaded(true);
        }}
        onAdLoaded={() => {
          setLoaded(true);
        }}
        onAdFailedToLoad={e => console.log('error: ', e)}
        onAdImpression={() => {}}
        style={{
          margin: 5,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.18,
          shadowRadius: 1.0,
          elevation: 1,
          display: loaded ? 'flex' : 'none',
        }}
        ref={ref => {
          nativeAdViewRef.current = ref;
        }}
        repository={props.repository}>
        <View
          style={[
            props.size === 'small' && {
              flexDirection: 'row',
              alignItems: 'center',
            },
          ]}>
          {props.size === 'small' ? <LayoutSmall /> : <LayoutLarge />}
        </View>
      </NativeAdView>
    )
  );
};

export default NativeAdsShow;

const styles = StyleSheet.create({
  container: {},
});
