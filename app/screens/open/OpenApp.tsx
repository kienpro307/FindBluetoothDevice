/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import {StyleSheet, AppState} from 'react-native';
import {AppOpenAd, AdEventType, TestIds} from 'react-native-google-mobile-ads';
import AdsContext from '../../ads/AdsContext';
import SplashScreen from 'react-native-splash-screen';
import OpenAppContext from './OpenAppContext';
// import {adjustSendEvent, adjustTrackAds} from '../../adjust/AdjustUtils';
import {ADJUST_EVENT, FIREBASE} from '../../constant';
import {firebaseSendEvent} from '../../firebase/FirebaseUtiils';
import {OPEN_ID, getPlacementId} from '../../ads/AdUtils';

interface OpenAppProps {
  children: React.ReactNode;
}

const appOpenAd = AppOpenAd.createForAdRequest(
  getPlacementId(TestIds.APP_OPEN, OPEN_ID),
  {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['bluetooth', 'find'],
  },
);
appOpenAd.load();

const OpenApp = (props: OpenAppProps) => {
  const isShowedApp = React.useRef<boolean>(false);
  const adsContext = React.useContext(AdsContext);
  const [showApp, setShowApp] = React.useState<boolean>(false);
  const showOpenAds = React.useRef<boolean>(false);
  const shouldShowOpenAds = React.useRef<boolean>(true);
  const refShowAds = React.useRef<boolean>(adsContext.showAds);
  // console.log('adcontext', adsContext.showAds);
  const onChangeShouldShowOpenAds = (v: boolean) => {
    shouldShowOpenAds.current = v;
  };

  React.useEffect(() => {
    refShowAds.current = adsContext.showAds;
  }, [adsContext.showAds]);

  React.useEffect(() => {
    let number = 0;
    // show open
    let interval = setInterval(() => {
      if (number >= 50 || !refShowAds.current) {
        if (interval) {
          clearInterval(interval);
        }
        setShowApp(true);
        isShowedApp.current = true;
        SplashScreen.hide();
        return;
      }

      if (appOpenAd.loaded) {
        // adjustSendEvent(ADJUST_EVENT.OPEN_ADS_SHOW);
        firebaseSendEvent(FIREBASE.OPEN_ADS_SHOW);
        appOpenAd.show();
        showOpenAds.current = true;
        clearInterval(interval);
      } else {
        number++;
        appOpenAd.load();
      }
    }, 100);

    // appOpenAd.addAdEventListener(AdEventType.PAID, (payload: any) => {
    //   if (payload?.value) {
    //     adjustTrackAds(payload.value);
    //   }
    // });

    // render app after view ads when open
    appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
      setShowApp(true);
      if (!isShowedApp.current) {
        SplashScreen.hide();
      }
      isShowedApp.current = true;
    });

    // closed ads after load ads again
    let loadInterval: null | NodeJS.Timeout = null;
    appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
      loadInterval = setInterval(() => {
        if (!appOpenAd.loaded) {
          appOpenAd.load();
        }
      }, 100);
    });

    // clear load
    appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
      if (loadInterval) {
        clearInterval(loadInterval);
      }
    });

    // show change status app
    const listener = AppState.addEventListener('change', st => {
      if (
        st === 'active' &&
        isShowedApp.current &&
        appOpenAd.loaded &&
        shouldShowOpenAds.current &&
        refShowAds.current
      ) {
        // adjustSendEvent(ADJUST_EVENT.OPEN_ADS_SHOW);
        firebaseSendEvent(FIREBASE.OPEN_ADS_SHOW);
        appOpenAd.show();
      }
      if (st === 'active') {
        shouldShowOpenAds.current = true;
      }
    });

    appOpenAd.addAdEventListener(AdEventType.OPENED, () => {
      // adjustSendEvent(ADJUST_EVENT.OPEN_ADS_DISPLAYED);
      firebaseSendEvent(FIREBASE.OPEN_ADS_DISPLAYED);
    });

    return () => {
      appOpenAd.removeAllListeners();
      listener.remove();
      if (loadInterval) {
        clearInterval(loadInterval);
      }
    };
  }, []);

  return (
    <OpenAppContext.Provider
      value={{
        onChangeShouldShowOpenAds,
      }}>
      {showApp ? props.children : null}
    </OpenAppContext.Provider>
  );
};

export default OpenApp;

const styles = StyleSheet.create({
  container: {},
});
