package com.flabs.find.bluetooth.devices.controller.impl;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothProfile;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanResult;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.location.LocationManager;
import android.os.Looper;
import android.os.Handler;
import android.util.Log;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.flabs.find.bluetooth.devices.controller.BluetoothScanListener;
import com.flabs.find.bluetooth.devices.controller.DeviceStateChangeListener;
import com.flabs.find.bluetooth.devices.controller.IBluetoothController;
import com.flabs.find.bluetooth.devices.model.BTDeviceModel;
import com.flabs.find.bluetooth.devices.utils.MappingUtils;
import java.lang.reflect.Method;
import java.util.HashSet;
import java.util.Set;
import kotlin.jvm.internal.Intrinsics;


public class DeviceController implements IBluetoothController, BluetoothScanListener, DeviceStateChangeListener {
    private BluetoothAdapter bluetoothAdapter;
    private BluetoothLeScanner bluetoothLeScanner;
    private BluetoothScanListener bluetoothScanListener;
    private DeviceStateChangeListener deviceStateChangeListener;
    private final ReactContext context;
    private boolean isScanningBLE;
    private boolean isScanningClassic;
    private BroadcastReceiver bluetoothClassicReceiver;
    private BroadcastReceiver bluetoothStateChangeReceiver;
    private BroadcastReceiver locationStateReceiver;
    private ScanCallback scanLeCallback;
    private  Handler handler;
    private final int discoveryDeadline = 12000;
    private BluetoothManager bluetoothManager;

    private String trackingAddress = null;

    public DeviceController(ReactContext context) {
        this.context = context;
        init();
    }

    private void init () {
        this.bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        this.bluetoothManager = (BluetoothManager) context.getSystemService(Context.BLUETOOTH_SERVICE);
        this.isScanningBLE = false;
        this.isScanningClassic = false;
        bluetoothScanListener = this;
        handler = new Handler(Looper.getMainLooper());
        initBluetoothClassicReceiver();
        initBluetoothStateReceiver();
        initLocationStateReceiver();
        initLeScanner();
    }

    private void initBluetoothClassicReceiver() {
        this.bluetoothClassicReceiver = new BroadcastReceiver() {
            @SuppressLint("MissingPermission")
            @Override
            public void onReceive(Context context, Intent intent) {
                String action = intent.getAction();
                if (BluetoothDevice.ACTION_FOUND.equals(action)) {
                    try {
                        BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                        int rssi = intent.getShortExtra(BluetoothDevice.EXTRA_RSSI, (short) BTDeviceModel.MIN_RSSI_VALUE);
                        assert device != null;
                        String deviceName = device.getName();
                        if (deviceName == null) return;
                        BTDeviceModel bDevice = new BTDeviceModel(device, rssi);
                        if(trackingAddress == null)
                            bluetoothScanListener.onDeviceFound(bDevice);
                        else {
                            bluetoothScanListener.onTrackingDevice(bDevice);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        };
    }

    private void initBluetoothStateReceiver() {
        this.bluetoothStateChangeReceiver = new BroadcastReceiver() {
            @Override
            @SuppressLint("MissingPermission")
            public void onReceive(Context context, Intent intent) {
                String action = intent.getAction();

                if(action.equals(BluetoothAdapter.ACTION_STATE_CHANGED)) {
                    int bluetoothState = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE, BluetoothAdapter.ERROR);
                    switch (bluetoothState) {
                        case BluetoothAdapter.STATE_OFF:
                            onBluetoothStateChange(false);
                            break;
                        case BluetoothAdapter.STATE_ON:
                            onBluetoothStateChange(true);
                            break;
                    }
                }
            }
        };
    }

    private void initLocationStateReceiver() {
        this.locationStateReceiver = new BroadcastReceiver() {
            @Override
            @SuppressLint("MissingPermission")
            public void onReceive(Context context, Intent intent) {
                String action = intent.getAction();

                if (action.equals(LocationManager.PROVIDERS_CHANGED_ACTION)) {
                    // Kiểm tra xem vị trí có được bật hay không
                    // Log.d("Location State", "Location Enabled: " + isLocationEnabled(context));
                    if (isLocationEnabled(context)) {
                        onLocationStateChange(true);
                    } else {
                        onLocationStateChange(false);
                    }
                }
            }
        };
    }

    private boolean isLocationEnabled(Context context) {
        LocationManager locationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
        if (locationManager != null) {
            return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
        }
        return false;
    }

    private void initLeScanner() {
        this.bluetoothLeScanner = this.bluetoothAdapter.getBluetoothLeScanner();
        this.scanLeCallback = new ScanCallback() {
            @SuppressLint("MissingPermission")
            @Override
            public void onScanResult(int callbackType, ScanResult result) {
                super.onScanResult(callbackType, result);
                if(result.getDevice().getName() == null) return;
                BTDeviceModel device = new BTDeviceModel(result.getDevice(), result.getRssi());
                if(trackingAddress == null)
                    bluetoothScanListener.onDeviceFound(device);
                else {
                    bluetoothScanListener.onTrackingDevice(device);
                }
            }
        };
    }

    @Override
    public  void onResume(ReactContext context) {
        Intrinsics.checkNotNullParameter(context, "context");
        try {
            context.registerReceiver(this.bluetoothClassicReceiver, new IntentFilter(BluetoothDevice.ACTION_FOUND));
            context.registerReceiver(this.bluetoothStateChangeReceiver, new IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED));
            context.registerReceiver(this.locationStateReceiver, new IntentFilter(LocationManager.PROVIDERS_CHANGED_ACTION));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public  void onPause(ReactContext c) {
        Intrinsics.checkNotNullParameter(c, "c");
        try {
            c.unregisterReceiver(this.bluetoothClassicReceiver);
            c.unregisterReceiver(this.bluetoothStateChangeReceiver);
            c.unregisterReceiver(this.locationStateReceiver);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void findDevice(BTDeviceModel device) {
        var type = device.getType();
        this.trackingAddress = device.getAddress();
        if(type == BluetoothDevice.DEVICE_TYPE_CLASSIC) {
            startClassicScan();
            return;
        }
        startBLEScan();
    }

    private boolean shouldScan() {
        return this.isScanningClassic || this.isScanningBLE;
    }
    @SuppressLint("MissingPermission")
    private void  startClassicScan() {
        bluetoothAdapter.startDiscovery();
        Log.i("TAG","START SCAN CLASSIC!!!!!!!!!!!");
        this.isScanningClassic = true;
        bluetoothScanListener.onScanningStateChange(true);
        //handle stop
        handler.postDelayed(this::stopClassicScan, discoveryDeadline);
    }

    @SuppressLint("MissingPermission")
    private void  startBLEScan() {
        bluetoothLeScanner.startScan(scanLeCallback);
        Log.i("TAG", "START SCAN BLE!!!!!!!!!!!!!!!!");
        this.isScanningBLE  = true;
        bluetoothScanListener.onScanningStateChange(true);
        //handle stop
        handler.postDelayed(this::stopBLEScan, discoveryDeadline);
    }

    @SuppressLint("MissingPermission")
    private void stopClassicScan() {
        if(bluetoothAdapter.isDiscovering())
            bluetoothAdapter.cancelDiscovery();
        this.isScanningClassic = false;
        bluetoothScanListener.onScanningStateChange(shouldScan());
    }

    @SuppressLint("MissingPermission")
    private void stopBLEScan() {
        try {
            if(this.isScanningBLE) {
                bluetoothLeScanner.stopScan(scanLeCallback);
                this.isScanningBLE = false;
            }
            bluetoothScanListener.onScanningStateChange(shouldScan());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @SuppressLint("MissingPermission")
    @Override
    public void startScanAll() {
        startBLEScan();
        startClassicScan();
    }

    @SuppressLint("MissingPermission")
    @Override
    public void stopScanAll() {
        stopBLEScan();
        stopClassicScan();
        this.trackingAddress = null;
    }

    @Override
    @SuppressLint("MissingPermission")
    public Set<BTDeviceModel> getListBond() {
        var listBond = this.bluetoothAdapter.getBondedDevices();
        Set<BTDeviceModel> results = new HashSet<>();   
        for(var item : listBond) {
            var device = new BTDeviceModel(item, BTDeviceModel.MIN_RSSI_VALUE);
            device.setIsConnected(false);
            results.add(device);
        }
        var connectedDevices = this.bluetoothManager.getConnectedDevices(BluetoothProfile.GATT);
        return results;
    }

    @Override
    public void onDeviceFound(BTDeviceModel device) {
        var params = MappingUtils.bluetoothDevice2WriteableMap(device);
        this.context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("event_device_found", params);
    }

    @Override
    @SuppressLint("MissingPermission")
    public void onBluetoothStateChange(boolean state) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putBoolean("isEnable", state);
        this.context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("bluetooth_state_change", writableMap);
    }

    @Override
    @SuppressLint("MissingPermission")
    public void onLocationStateChange(boolean state) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putBoolean("isEnable", state);
        this.context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("location_state_change", writableMap);
    }


    @Override
    public void onScanningStateChange(boolean state) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putBoolean("isScanning", state);
        this.context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("event_scanning_state_change", writableMap);
    }

    @Override
    public void onTrackingDevice(BTDeviceModel device) {
        if(device.getAddress().equals(trackingAddress)) {
            var params = MappingUtils.bluetoothDevice2WriteableMap(device);
            this.context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("event_tracking_device", params);
            stopScanAll();
        }
    }

    private void pairDevice(BluetoothDevice device) {
        try {
            //waitingForBonding = true;
            Method m = device.getClass()
                    .getMethod("createBond", (Class[]) null);
            m.invoke(device, (Object[]) null);
        } catch (Exception e) {
            Log.e("TAG", e.getMessage());
        }
    }

    private void unpairDevice(BluetoothDevice device) {
        try {
            Method m = BluetoothDevice.class
                    .getMethod("removeBond", (Class[]) null);
            m.invoke(device, (Object[]) null);
        } catch (Exception e) {
            Log.e("TAG", e.getMessage());
        }
    }
}
