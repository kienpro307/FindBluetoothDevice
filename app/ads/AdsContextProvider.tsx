/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import {StyleSheet} from 'react-native';
import AdsContext from './AdsContext';
// import {adjustSendEvent, adjustTrackAds} from '../adjust/AdjustUtils';
import {ADJUST_EVENT, FIREBASE} from '../constant';
// import PurcharseContext from '../purcharse/PurcharseContext';
import {firebaseSendEvent} from '../firebase/FirebaseUtiils';
import {
  AdsConsent,
  AdsConsentStatus,
  MobileAds,
  TestIds,
  useInterstitialAd,
  useRewardedAd,
} from 'react-native-google-mobile-ads';
import {INTER_ID, REWARD_ID, getPlacementId} from './AdUtils';
import {loadNativeAds} from './NativeAdsUtils';
import {REMOTE_KEY, useRemote} from '../remoteConfig/RemoteConfig';
import ModalLoadingAds from './ModalLoadingAds';
interface AdsContextProviderProps {
  children: React.ReactNode;
}

const rewardID = getPlacementId(TestIds.REWARDED, REWARD_ID);
const interID = getPlacementId(TestIds.INTERSTITIAL, INTER_ID);

const AdsContextProvider = (props: AdsContextProviderProps) => {
  const openReward = React.useRef<(() => void) | undefined>(undefined);
  const closeReward = React.useRef<(() => void) | undefined>(undefined);
  // const purchaseContext = React.useContext(PurcharseContext);
  const {
    isLoaded: isLoadedRV,
    isOpened: isOpenedRV,
    isClosed: isClosedRV,
    load: loadRV,
    show: showRV,
    revenue: revenueRV,
    isEarnedReward: isEarnedReward,
  } = useRewardedAd(rewardID);

  const {
    isLoaded: isLoadedIS,
    isOpened: isOpenedIS,
    isClosed: isClosedIS,
    load: loadIS,
    show: showIS,
    revenue: revenueIS,
  } = useInterstitialAd(interID);

  const loadedRWRef = React.useRef(isLoadedRV);
  const loadedISRef = React.useRef(isLoadedIS);
  const intervalRef = React.useRef<NodeJS.Timeout | undefined>();
  const refShowIS = React.useRef(showIS);
  const refShowRW = React.useRef(showRV);
  const [consentUMP, setConsentUMP] = React.useState<boolean>(false);
  const isInited = React.useRef<boolean>(false);
  const [showAdsAfterConsent, setShowAdsAfterConsent] =
    React.useState<boolean>(false);
  // const showAds = !purchaseContext.purcharsed && showAdsAfterConsent;
  const [showAds, setShowAds] = React.useState<boolean>(showAdsAfterConsent);
  // const showAds = showAdsAfterConsent;
  const showAdsAfterConsentError = useRemote(
    REMOTE_KEY.show_ads_when_consent_error,
  );
  const [showLoadingAds, setShowLoadingAds] = React.useState<boolean>(false);

  React.useEffect(() => {
    console.log('im in use effect');
    setShowAds(showAdsAfterConsent);
    // AdsContext.setShowAd
  }, [showAdsAfterConsent]);

  const forceWaitShowRW = (
    timeSecond: number,
    onOpened?: () => void,
    onClosed?: () => void,
  ): Promise<boolean> => {
    if (!showAds) return Promise.resolve(false);
    // adjustSendEvent(ADJUST_EVENT.REWARD_SHOW);
    firebaseSendEvent(FIREBASE.REWARD_SHOW);

    return new Promise((resolve, reject) => {
      let number = 0;
      const func = () => {
        if (loadedRWRef.current) {
          openReward.current = onOpened;
          closeReward.current = onClosed;
          refShowRW.current();
          resolve(true);
          clearInterval(intervalRef.current);
          return;
        }
        if (loadedISRef.current) {
          openReward.current = onOpened;
          closeReward.current = onClosed;
          // adjustSendEvent(ADJUST_EVENT.INTER_SHOW);
          firebaseSendEvent(FIREBASE.INTER_SHOW);
          refShowIS.current();
          resolve(true);
          clearInterval(intervalRef.current);
          return;
        }
        loadRV();
        loadIS();
        number++;
        if (number > timeSecond) {
          resolve(false);
          clearInterval(intervalRef.current);
        }
      };
      intervalRef.current = setInterval(func, 1000);
      func();
    });
  };

  const forceWaitShowIS = (
    timeSecond: number,
    onOpened?: () => void,
    onClosed?: () => void,
  ): Promise<boolean> => {
    if (!showAds) return Promise.resolve(false);
    return new Promise((resolve, reject) => {
      let number = 0;
      const func = () => {
        if (loadedISRef.current) {
          openReward.current = onOpened;
          closeReward.current = onClosed;
          // adjustSendEvent(ADJUST_EVENT.INTER_SHOW);
          firebaseSendEvent(FIREBASE.INTER_SHOW);
          refShowIS.current();
          resolve(true);
          clearInterval(intervalRef.current);
          return;
        }
        loadIS();
        number++;
        if (number > timeSecond) {
          resolve(false);
          clearInterval(intervalRef.current);
          // adjustSendEvent(ADJUST_EVENT.INTER_SHOW);
          firebaseSendEvent(FIREBASE.INTER_SHOW);
        }
      };
      intervalRef.current = setInterval(func, 1000);
      func();
    });
  };

  const showRewardedVideo = async (
    onOpened?: () => void,
    onClosed?: () => void,
  ) => {
    if (!showAds) return Promise.resolve(false);
    // adjustSendEvent(ADJUST_EVENT.REWARD_SHOW);
    firebaseSendEvent(FIREBASE.REWARD_SHOW);
    if (!isLoadedRV) {
      loadRV();
      if (isLoadedIS) {
        return showInter(onOpened, onClosed);
      }
      return Promise.resolve(false);
    }

    openReward.current = onOpened;
    closeReward.current = onClosed;
    showRV();
    return Promise.resolve(true);
  };

  const showInter = async (onOpened?: () => void, onClosed?: () => void) => {
    if (!showAds) return Promise.resolve(false);
    // adjustSendEvent(ADJUST_EVENT.INTER_SHOW);
    firebaseSendEvent(FIREBASE.INTER_SHOW);
    if (!isLoadedIS) {
      loadIS();
      return Promise.resolve(false);
    }

    openReward.current = onOpened;
    closeReward.current = onClosed;
    showIS();
    return Promise.resolve(true);
  };

  const initSDK = () => {
    if (isInited.current) return;
    isInited.current = true;
    console.log('im in init');
    MobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log(adapterStatuses);
        loadNativeAds();
      });
  };

  const showConsentUMPAndInitSDK = async () => {
    try {
      console.log('im in ump');
      // const consentInfo = {
      //   status: AdsConsentStatus.REQUIRED,
      //   canRequestAds: undefined,
      // };
      const consentInfo = await AdsConsent.requestInfoUpdate();
      if (
        consentInfo.status === AdsConsentStatus.OBTAINED ||
        consentInfo.status === AdsConsentStatus.NOT_REQUIRED
      ) {
        if (consentInfo.canRequestAds) {
          console.log('im in 1');
          initSDK();
          setShowAdsAfterConsent(true);
        }
        setConsentUMP(true);
        return;
      }

      if (consentInfo.canRequestAds) {
        console.log('im in 2');
        initSDK();
      }

      const formResult = await AdsConsent.loadAndShowConsentFormIfRequired();
      console.log('formResult canRequestAds', formResult.canRequestAds);
      if (formResult.canRequestAds) {
        console.log('im in 3');
        initSDK();
        setShowAdsAfterConsent(formResult.canRequestAds);
      }
      setConsentUMP(true);
    } catch (err) {
      console.log('im in 4');
      console.log(
        'showAdsAfterConsentError().asBoolean()',
        showAdsAfterConsentError().asBoolean(),
      );
      setConsentUMP(true);
      // if (false) {
      if (showAdsAfterConsentError().asBoolean()) {
        console.log('im in init and bla bla');
        initSDK();
        setShowAdsAfterConsent(true);
      }
    }
  };

  const setShowLoading = (v: boolean) => {
    if (!showAds) return setShowLoadingAds(false);
    setShowLoadingAds(v);
  };

  React.useEffect(() => {
    showConsentUMPAndInitSDK();
  }, []);

  React.useEffect(() => {
    if (isClosedRV) {
      // adjustSendEvent(ADJUST_EVENT.REWARD_DISPLAYED);
      firebaseSendEvent(FIREBASE.REWARD_DISPLAYED);
    }
    if (isClosedIS) {
      // adjustSendEvent(ADJUST_EVENT.INTER_DISPLAYED);
      firebaseSendEvent(FIREBASE.INTER_DISPLAYED);
    }
    if ((isClosedRV || isClosedIS) && closeReward.current) {
      closeReward.current();
      closeReward.current = undefined;
    }
  }, [isClosedRV, isClosedIS]);

  React.useEffect(() => {
    if ((isOpenedRV || isOpenedIS) && openReward.current) {
      openReward.current();
      openReward.current = undefined;
    }
  }, [isOpenedIS, isOpenedRV]);

  React.useEffect(() => {
    if (!isLoadedIS) loadIS();
    if (!isLoadedRV) loadRV();
  }, [loadIS, loadRV, isLoadedIS, isLoadedRV]);

  // React.useEffect(() => {
  //   if (revenueIS) {
  //     adjustTrackAds(revenueIS.value);
  //   }
  // }, [revenueIS]);

  // React.useEffect(() => {
  //   if (revenueRV) {
  //     adjustTrackAds(revenueRV.value);
  //   }
  // }, [revenueRV]);

  React.useEffect(() => {
    loadedISRef.current = isLoadedIS;
    loadedRWRef.current = isLoadedRV;
    refShowIS.current = showIS;
    refShowRW.current = showRV;
  }, [isLoadedRV, isLoadedIS, showIS, showRV]);

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <AdsContext.Provider
      value={{
        showRewardedVideo,
        showInter,
        showAds: showAds,
        forceShowRewardedVideo: forceWaitShowRW,
        forceShowInter: forceWaitShowIS,
        setShowLoading,
      }}>
      <ModalLoadingAds visible={showLoadingAds} />
      {consentUMP && props.children}
    </AdsContext.Provider>
  );
};

export default AdsContextProvider;

const styles = StyleSheet.create({
  container: {},
});
