/* eslint-disable prettier/prettier */
export interface BluetoothDeviceInfo {
  address: string;
  alias: string;
  deviceClass: number;
  lastDiscovered: number;
  name: string;
  rssi: number;
  type: number;
  isConnected: boolean;
}

export interface Option {
  nameDevice: string;
  title: string;
  image: any;
  select: boolean;
}

export interface Filter {
  type: string;
  options: string[];
}
