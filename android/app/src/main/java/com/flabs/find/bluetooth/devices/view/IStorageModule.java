package com.flabs.find.bluetooth.devices.view;

import com.facebook.react.bridge.Promise;

public interface IStorageModule {
    void setItem(String key, String value);
    void getItem(String key, Promise promise);
}
