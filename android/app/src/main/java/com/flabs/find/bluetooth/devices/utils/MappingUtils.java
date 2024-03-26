package com.flabs.find.bluetooth.devices.utils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.flabs.find.bluetooth.devices.model.BTDeviceModel;

public class MappingUtils {
    public static WritableMap bluetoothDevice2WriteableMap (BTDeviceModel device) {
        WritableMap params = Arguments.createMap();
        params.putString("name", device.getName());
        params.putString("alias", device.getAlias());
        params.putString("address", device.getAddress());
        params.putInt("rssi", device.getRssi());
        params.putDouble("lastDiscovered", device.getLastDiscovered());
        params.putInt("type", device.getType());
        params.putInt("deviceClass", device.getDeviceClass());
        params.putBoolean("isConnected", device.getIsConnected());
        return params;
    }

    public static BTDeviceModel readableMap2BluetoothDevice (ReadableMap readableMap) {
        BTDeviceModel device = new BTDeviceModel();
        device.setName(readableMap.getString("name"));
        device.setAddress(readableMap.getString("address"));
        device.setAlias(readableMap.getString("alias"));
        device.setType(readableMap.getInt("type"));
        device.setDeviceClass(readableMap.getInt("deviceClass"));
        device.setRssi(readableMap.getInt("rssi"));
        device.setLastDiscovered((long) readableMap.getDouble("lastDiscovered"));
        return device;
    }
}
