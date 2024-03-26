package com.flabs.find.bluetooth.devices.view;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;

public interface IBluetoothView {
    void onResume();
    void onPause();
    void isBluetoothEnabled(Promise promise);
    void isLocationEnabled(Promise promise);
    void turnOnLocation();
    void turnOnBluetooth();
    void turnOffLocation();
    void turnOffBluetooth();
    void startScanAll();
    void stopScanAll();
    void getListBondDevices(Promise promise);
    void findDevice(ReadableMap readableMap);
}
