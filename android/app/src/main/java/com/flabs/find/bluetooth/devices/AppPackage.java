package com.flabs.find.bluetooth.devices;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.flabs.find.bluetooth.devices.view.impl.BluetoothModule;
import com.flabs.find.bluetooth.devices.view.impl.StorageModule;

import java.util.Collections;
import java.util.List;

public class AppPackage implements ReactPackage {
    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactApplicationContext) {
        return List.of(new BluetoothModule(reactApplicationContext),
                new StorageModule(reactApplicationContext));
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactApplicationContext) {
        return Collections.emptyList();
    }
}
