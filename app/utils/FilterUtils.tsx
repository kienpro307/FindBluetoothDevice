/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import {BluetoothDeviceInfo} from '../type';
import {deviceType} from './IconDeviceUtils';

export const filterUtils = (
  options: string[],
  devices: BluetoothDeviceInfo[],
) => {
  const deviceFilter = devices.filter(device => {
    return options.includes(deviceType(device.deviceClass));
  });

  return deviceFilter;
};
