package com.flabs.find.bluetooth.devices.view.impl;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.flabs.find.bluetooth.devices.controller.IBluetoothController;
import com.flabs.find.bluetooth.devices.controller.impl.DeviceController;
import com.flabs.find.bluetooth.devices.utils.BluetoothUtils;
import com.flabs.find.bluetooth.devices.utils.MappingUtils;
import com.flabs.find.bluetooth.devices.view.IBluetoothView;

import java.util.Objects;

public class BluetoothModule extends ReactContextBaseJavaModule implements IBluetoothView{
    private final IBluetoothController bluetoothController;

    public BluetoothModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.bluetoothController = new DeviceController(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "BluetoothModule";
    }

    @ReactMethod
    public void startScanAll() {
        this.bluetoothController.startScanAll();
    }

    @ReactMethod
    public void stopScanAll() {
        this.bluetoothController.stopScanAll();
    }

    @ReactMethod
    @Override
    public void onResume() {
        this.bluetoothController.onResume(getReactApplicationContext());
    }

    @ReactMethod
    @Override
    public void onPause() {
        this.bluetoothController.onPause(getReactApplicationContext());
    }

    @ReactMethod
    @Override
    public void isBluetoothEnabled(Promise promise) {
        promise.resolve(BluetoothUtils.isBluetoothEnabled());
    }

    @ReactMethod
    @Override
    public void isLocationEnabled(Promise promise) {
        promise.resolve(BluetoothUtils.isLocationEnabled(getReactApplicationContext()));
    }

    @ReactMethod
    @Override
    public void turnOnLocation() {
        BluetoothUtils.turnOnLocation(Objects.requireNonNull(getCurrentActivity()));
    }

    @ReactMethod
    @Override
    public void turnOnBluetooth() {
        BluetoothUtils.turnOnBluetooth(getCurrentActivity());
    }

    @ReactMethod
    @Override
    public void turnOffLocation() {
        BluetoothUtils.turnOffLocation(Objects.requireNonNull(getCurrentActivity()));
    }

    @ReactMethod
    @Override
    public void turnOffBluetooth() {
        BluetoothUtils.turnOffBluetooth(getCurrentActivity());
    }

    @ReactMethod
    public void getListBondDevices(Promise promise) {
        try {
            var listBondDevices = bluetoothController.getListBond();
            WritableArray writableArray = Arguments.createArray();
            for(var item : listBondDevices) {
                var params = MappingUtils.bluetoothDevice2WriteableMap(item);
                writableArray.pushMap(params);
            }
            promise.resolve(writableArray);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void findDevice(ReadableMap readableMap) {
        var device = MappingUtils.readableMap2BluetoothDevice(readableMap);
        bluetoothController.findDevice(device);
    }
}
