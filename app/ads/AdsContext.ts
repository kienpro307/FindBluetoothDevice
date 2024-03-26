/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

const AdsContext = React.createContext<{
  showRewardedVideo: (
    onOpened?: () => void,
    onClosed?: () => void,
  ) => Promise<boolean>;
  showInter: (onOpened?: () => void, onClosed?: () => void) => Promise<boolean>;
  forceShowRewardedVideo: (
    timeSecond: number,
    onOpened?: () => void,
    onClosed?: () => void,
  ) => Promise<boolean>;
  forceShowInter: (
    timeSecond: number,
    onOpened?: () => void,
    onClosed?: () => void,
  ) => Promise<boolean>;
  showAds: boolean;
  setShowLoading: (v: boolean) => void;
}>({
  showRewardedVideo: () => Promise.resolve(false),
  showInter: () => Promise.resolve(false),
  forceShowRewardedVideo: (
    v: number,
    onOpened?: () => void,
    onClosed?: () => void,
  ) => Promise.resolve(false),
  forceShowInter: (v: number, onOpened?: () => void, onClosed?: () => void) =>
    Promise.resolve(false),
  showAds: false,
  setShowLoading: (v: boolean) => undefined,
});

export const useAds = () => React.useContext(AdsContext);

export default AdsContext;
