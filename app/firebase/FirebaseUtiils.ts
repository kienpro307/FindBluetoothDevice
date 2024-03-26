/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import analytics from '@react-native-firebase/analytics';
// import {FIREBASE} from '../constant';
import {isDev} from '../utils';

export const firebaseSendEvent = async (
  eventName: string,
  params?: {[key: string]: any},
) => {
  if (isDev()) return Promise.resolve('ok');
  await analytics().logEvent(eventName, params);
};
