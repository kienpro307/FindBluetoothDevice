package com.flabs.find.bluetooth.devices.model;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothDevice;

import java.util.Date;

import kotlin.jvm.internal.Intrinsics;

public class BTDeviceModel {
    public static final int MIN_RSSI_VALUE = Short.MIN_VALUE;
    private static volatile int deviceNum;
    private BluetoothDevice bluetoothDevice;
    private String name;
    private String alias;
    private String address;
    private int rssi;
    private Long lastDiscovered;
    private int type;  // classic : 1, dual: 3, le: 2, unknown: 0
    private int deviceClass;
    private boolean isConnected;

    public BTDeviceModel() {
    }

    public BTDeviceModel(String name, String address, int rssi, int type) {
        Intrinsics.checkNotNullParameter(name, "name");
        Intrinsics.checkNotNullParameter(address, "address");
        this.name = name;
        this.address = address;
        this.rssi = rssi;
        this.type = type;
        this.lastDiscovered = new Date().getTime();
    }

    @SuppressLint("MissingPermission")
    public BTDeviceModel(BluetoothDevice bluetoothDevice, int rssi) {
        Intrinsics.checkNotNullParameter(bluetoothDevice, "device");
        String address = bluetoothDevice.getAddress();
        Intrinsics.checkNotNullParameter(address, "device.address");
        this.address  = address;
        this.name = address;
        this.type = bluetoothDevice.getType();
        if (bluetoothDevice.getBluetoothClass() != null) {
            this.deviceClass = bluetoothDevice.getBluetoothClass().getMajorDeviceClass();
        } else {
            this.deviceClass = 7936;
        }
        this.rssi = rssi;
        this.lastDiscovered = new Date().getTime();
        if(bluetoothDevice.getName() != null) {
            this.name = bluetoothDevice.getName();
        }
    }

    public boolean equals(Object obj) {
        if (obj instanceof BTDeviceModel) {
            return Intrinsics.areEqual(this.address, ((BTDeviceModel) obj).address);
        }
        return false;
    }


    public final String approximateDistance() {
        int i = this.rssi;
        return i > -40 ? "0.5m" : i > -60 ? "1m" : i > -70 ? "2m" : i > -75 ? "3m" : i > -80 ? "4m" : i > -90 ? "5m" : "> 5m";
    }


    public static int getDeviceNum() {
        return deviceNum;
    }

    public static void setDeviceNum(int deviceNum) {
        BTDeviceModel.deviceNum = deviceNum;
    }

    public BluetoothDevice getBluetoothDevice() {
        return bluetoothDevice;
    }

    public void setBluetoothDevice(BluetoothDevice bluetoothDevice) {
        this.bluetoothDevice = bluetoothDevice;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getRssi() {
        return rssi;
    }

    public void setRssi(int rssi) {
        this.rssi = rssi;
    }

    public Long getLastDiscovered() {
        return lastDiscovered;
    }

    public void setLastDiscovered(Long lastDiscovered) {
        this.lastDiscovered = lastDiscovered;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public int getDeviceClass() {
        return deviceClass;
    }

    public void setDeviceClass(int deviceClass) {
        this.deviceClass = deviceClass;
    }

    public boolean getIsConnected() {
        return isConnected;
    }

    public void setIsConnected(boolean isConnected) {
        this.isConnected = isConnected;
    }
}
