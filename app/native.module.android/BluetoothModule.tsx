/* eslint-disable prettier/prettier */
import {NativeModules} from 'react-native';
import {BluetoothDeviceInfo} from '../type';
const {BluetoothModule} = NativeModules;

interface IBluetoothModule {
  startScanAll(): void;
  stopScanAll(): void;
  onResume(): void;
  onPause(): void;
  getListBondDevices(): Promise<Array<BluetoothDeviceInfo>>;
  findDevice(device: BluetoothDeviceInfo): void; // tìm kiếm device theo id
  isBluetoothEnabled(): Promise<boolean>;
  isLocationEnabled(): Promise<boolean>;
  turnOnLocation(): void;
  turnOnBluetooth(): void;
  turnOffBluetooth(): void;
  turnOffLocation(): void;
}

export default BluetoothModule as IBluetoothModule;
