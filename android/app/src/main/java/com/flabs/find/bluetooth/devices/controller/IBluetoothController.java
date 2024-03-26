package com.flabs.find.bluetooth.devices.controller;

import com.facebook.react.bridge.ReactContext;
import com.flabs.find.bluetooth.devices.model.BTDeviceModel;

import java.util.Set;

public interface IBluetoothController {
    void startScanAll();
    void stopScanAll();
    Set<BTDeviceModel> getListBond();
    void onResume(ReactContext context);
    void onPause(ReactContext context);

    void findDevice(BTDeviceModel device);
}
