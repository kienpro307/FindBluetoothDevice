/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {useEventCallback} from '../useEventCallback';
import remote from '@react-native-firebase/remote-config';

export const REMOTE_KEY = {
  re_scan_number_free: 're_scan_number_free',
  last_version: 'last_version',
  last_version_force_update: 'last_version_force_update',
  last_version_priority: 'last_version_priority',
  show_ads_when_consent_error: 'show_ads_when_consent_error',
};

export const useRemote = (key: string) => {
  return useEventCallback(() => {
    return remote().getValue(key);
  }, []);
};

export const RemoteConfigProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  React.useEffect(() => {
    remote()
      .setDefaults({
        [REMOTE_KEY.re_scan_number_free]: 6,
        [REMOTE_KEY.last_version]: 4,
        [REMOTE_KEY.last_version_force_update]: 4,
        [REMOTE_KEY.last_version_priority]: 1,
        [REMOTE_KEY.show_ads_when_consent_error]: true,
      })
      .then(r => remote().fetch(3600))
      .then(r => remote().activate())
      .then(r => {
        console.log(
          r ? 'Fetch remote config success' : 'Fetch remote config error',
        );
      })
      .catch(err => {});
  }, []);
  return children;
};
