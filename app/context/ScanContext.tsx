/* eslint-disable prettier/prettier */
import React from 'react';
import {BluetoothDeviceInfo, Filter} from '../type';

const ScanContext = React.createContext<{
  numDevices: number; // số lượng thiết bị bluetooth tìm được
  listDevice: Array<BluetoothDeviceInfo>; // dánh sách các thiết bị bluetooth tìm được
  isScanning: boolean; // trạng thái có đang scan hay không
  filter: Filter[];
  isBluetoothEnabled: boolean; //Bluetooth có đang được bật hay không
  isLocationEnabled: boolean;
  clearListDevice: () => void;
  setFilterContext: (type: string, newOptions: string[]) => void;
}>({
  numDevices: 0,
  listDevice: [],
  isScanning: false,
  filter:[],
  isBluetoothEnabled: false,
  isLocationEnabled: false,
  clearListDevice: () => Promise.resolve(false),
  setFilterContext: () => {},
});

export default ScanContext;
