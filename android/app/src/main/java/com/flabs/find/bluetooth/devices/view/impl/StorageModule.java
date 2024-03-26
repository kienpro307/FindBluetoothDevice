package com.flabs.find.bluetooth.devices.view.impl;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.flabs.find.bluetooth.devices.utils.SharedPreferenceUtils;
import com.flabs.find.bluetooth.devices.view.IStorageModule;

public class StorageModule extends ReactContextBaseJavaModule implements IStorageModule {

    public StorageModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return "StorageModule";
    }

    @ReactMethod
    @Override
    public void setItem(String key, String value) {
        SharedPreferenceUtils.save(getReactApplicationContext(), key, value);
    }

    @ReactMethod
    @Override
    public void getItem(String key, Promise promise) {
        try{
            String value = SharedPreferenceUtils.getValue(getReactApplicationContext(), key);
            promise.resolve(value);
        } catch(Exception e) {
            e.printStackTrace();
        }
    }
}