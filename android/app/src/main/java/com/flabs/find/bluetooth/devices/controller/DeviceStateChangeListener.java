package com.flabs.find.bluetooth.devices.controller;

public interface DeviceStateChangeListener {
    void onBluetoothStateChange(boolean state);
    void onLocationStateChange(boolean state);
}
