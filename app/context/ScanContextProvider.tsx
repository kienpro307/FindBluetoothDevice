/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {NativeEventEmitter} from 'react-native';
import ScanContext from './ScanContext';
import BluetoothModule from '../native.module.android/BluetoothModule';
import {BluetoothDeviceInfo, Filter} from '../type';

interface ScanContextProviderProps {
  children: React.ReactNode;
}

const ScanContextProvider = (props: ScanContextProviderProps) => {
  const [listDevice, setListDevice] = React.useState<
    Array<BluetoothDeviceInfo>
  >([]);
  const [numDevices, setNumDevices] = React.useState<number>(0);
  const [isScanning, setScanning] = React.useState<boolean>(false);
  const [isBluetoothEnabled, setBluetoothEnable] =
    React.useState<boolean>(false);
  const [isLocationEnabled, setLocationEnable] = React.useState<boolean>(false);
  const [filter, setFilter] = React.useState<Filter[]>([]);

  React.useEffect(() => {
    BluetoothModule.onResume();
    return () => {
      BluetoothModule.onPause();
    };
  }, []);

  const addDevice = (item: BluetoothDeviceInfo) => {
    setListDevice(old => {
      const existingIndex = old.findIndex(
        device => device.address == item.address,
      );
      if (existingIndex === -1) {
        setNumDevices(num => num + 1);
        return [item, ...old];
      }
      const updatedList = [...old];
      updatedList[existingIndex] = item;
      return updatedList;
    });
  };

  const fetchStatusData = async () => {
    const isBluetoothEnabledTemp = await BluetoothModule.isBluetoothEnabled();
    const isLocationEnabledTemp = await BluetoothModule.isLocationEnabled();
    setBluetoothEnable(isBluetoothEnabledTemp);
    setLocationEnable(isLocationEnabledTemp);
  };

  React.useEffect(() => {
    fetchStatusData();
    const eventEmitter = new NativeEventEmitter();
    const eventDeviceFoundListener = eventEmitter.addListener(
      'event_device_found',
      (data: BluetoothDeviceInfo) => {
        // console.log('Find ALL');
        // console.log(data);
        addDevice(data);
      },
    );

    const eventScanningListener = eventEmitter.addListener(
      'event_scanning_state_change',
      (event: {isScanning: boolean}) => {
        setScanning(event.isScanning);
      },
    );

    const eventBluetoothStateListener = eventEmitter.addListener(
      'bluetooth_state_change',
      (event: {isEnable: boolean}) => {
        setBluetoothEnable(event.isEnable);
      },
    );

    const eventLocationStateListener = eventEmitter.addListener(
      'location_state_change',
      (event: {isEnable: boolean}) => {
        // console.log('Location State Change:', event.isEnable);
        setLocationEnable(event.isEnable);
      },
    );

    return () => {
      eventDeviceFoundListener.remove();
      eventScanningListener.remove();
      eventBluetoothStateListener.remove();
      eventLocationStateListener.remove();
    };
  }, []);

  const clearListDevice = () => {
    setListDevice([]);
    setNumDevices(0);
  };

  const setFilterContext = (type: string, newOptions: string[]) => {
    const existingFilter = filter.find(f => f.type === type);
    if (existingFilter) {
      const updatedFilter = filter.map(f =>
        f.type === type ? {...f, options: newOptions} : f,
      );
      setFilter(updatedFilter);
    } else {
      // Nếu không, thêm một filter mới
      const newFilter = [...filter, {type, options: newOptions}];
      setFilter(newFilter);
    }
  };

  return (
    <ScanContext.Provider
      value={{
        numDevices,
        listDevice,
        isScanning,
        filter,
        isBluetoothEnabled,
        isLocationEnabled,
        clearListDevice,
        setFilterContext,
      }}>
      {props.children}
    </ScanContext.Provider>
  );
};

export default ScanContextProvider;
