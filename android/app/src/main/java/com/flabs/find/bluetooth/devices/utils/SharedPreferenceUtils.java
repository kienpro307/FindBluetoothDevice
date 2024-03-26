package com.flabs.find.bluetooth.devices.utils;

import android.content.Context;
import android.content.SharedPreferences;

import com.flabs.find.bluetooth.devices.constant.Constants;

public class SharedPreferenceUtils {
    public static void save(Context context, String key, String value) {
        if(context == null) {
            return;
        }
        SharedPreferences preferences = context.getSharedPreferences(Constants.PACKAGE_NAME,
                Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = preferences.edit();

        editor.putString(key, value);
        editor.apply();
    }

    public static String getValue(Context context, String key) {
        if(context == null) {
            return null;
        }
        SharedPreferences preferences = context.getSharedPreferences(Constants.PACKAGE_NAME,
                Context.MODE_PRIVATE);
        return preferences.getString(key, null);
    }

}