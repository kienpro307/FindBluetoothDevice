package com.flabs.find.bluetooth.devices.controller;

import com.flabs.find.bluetooth.devices.model.BTDeviceModel;

public interface BluetoothScanListener {
    void onDeviceFound(BTDeviceModel device);
    void onScanningStateChange(boolean state);
    void onTrackingDevice(BTDeviceModel device);
}
