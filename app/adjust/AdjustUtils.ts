/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Adjust,
  AdjustAdRevenue,
  AdjustConfig,
  AdjustEvent,
} from 'react-native-adjust';

export const adjustSendEvent = (
  eventName: string,
  revenue?: number,
  currency?: string,
) => {
  const adjustEvent = new AdjustEvent(eventName);
  if (revenue && currency) {
    adjustEvent.setRevenue(revenue, currency);
  }
  Adjust.trackEvent(adjustEvent);
};

export const adjustTrackAds = (rev: number) => {
  const revenue = new AdjustAdRevenue('admob_sdk');
  revenue.setRevenue(rev, 'USD');
  Adjust.trackAdRevenue(revenue);
};
