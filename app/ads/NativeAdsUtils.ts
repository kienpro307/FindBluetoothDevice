/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AdManager, TestIds } from 'react-native-admob-native-ads';
import {NATIVE_ID, getPlacementId} from './AdUtils';

export const loadNativeAds = () => {
  AdManager.registerRepository({
    name: 'simple',
    adUnitId: getPlacementId(TestIds.Image, NATIVE_ID),
    numOfAds: 20,
  }).then(result => {
  });
  AdManager.subscribe('simple', 'onAdPreloadImpression', (data: any) => {
  });
};
