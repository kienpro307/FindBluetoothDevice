package com.flabs.find.bluetooth.devices.utils;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.os.Build;
import android.provider.Settings;
import android.widget.Toast;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.flabs.find.bluetooth.devices.constant.Constants;
import java.util.ArrayList;
import kotlin.jvm.internal.Intrinsics;

public class BluetoothUtils {
    static final int GRANTED = PackageManager.PERMISSION_GRANTED;

    public static boolean isBluetoothEnabled() {
        BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (bluetoothAdapter != null) {
            return bluetoothAdapter.isEnabled();
        }
        return false;
    }

    @SuppressLint("MissingPermission")
    public static void turnOnBluetooth(Activity a) {
        Intrinsics.checkNotNullParameter(a, "a");
        BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (bluetoothAdapter == null || bluetoothAdapter.isEnabled()) {
            return;
        }
        try {
            a.startActivityForResult(new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE), Constants.BT_PERMISSION);
        } catch (ActivityNotFoundException unused) {
            Toast.makeText(a, "Please enable Bluetooth!", Toast.LENGTH_SHORT).show();
        }
    }

    @SuppressLint("MissingPermission")
    public static void turnOffBluetooth(Context context) {
        BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (bluetoothAdapter != null && bluetoothAdapter.isEnabled()) {
            Intent intent = new Intent(Settings.ACTION_BLUETOOTH_SETTINGS);
            context.startActivity(intent);
        }
    }


    public static boolean isLocationEnabled(Context context) {
        LocationManager locationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
    }

    public static void turnOnLocation(Activity a) {
        if(BluetoothUtils.isLocationEnabled(a.getBaseContext())) return;
        try {
            a.startActivityForResult(new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS), 16);
        } catch (Exception e) {
            Toast.makeText(a, "Please enable Location!", Toast.LENGTH_SHORT).show();
        }
    }

    public static void turnOffLocation(Context context) {
        LocationManager locationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
        if (locationManager != null && locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
            Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
        }
    }


    public static boolean areAllPermissionAllowed(Context c) {
        Intrinsics.checkNotNullParameter(c, "c");
        if (Build.VERSION.SDK_INT >= 31) {
            return ContextCompat.checkSelfPermission(c, "android.permission.BLUETOOTH") == GRANTED
                    && ContextCompat.checkSelfPermission(c, "android.permission.BLUETOOTH_ADMIN") == GRANTED
                    && ContextCompat.checkSelfPermission(c, "android.permission.BLUETOOTH_CONNECT") == GRANTED
                    && ContextCompat.checkSelfPermission(c, "android.permission.BLUETOOTH_SCAN") == GRANTED
                    && ContextCompat.checkSelfPermission(c, "android.permission.ACCESS_COARSE_LOCATION") == GRANTED
                    && ContextCompat.checkSelfPermission(c, "android.permission.ACCESS_FINE_LOCATION") == GRANTED;
        } else return ContextCompat.checkSelfPermission(c, "android.permission.BLUETOOTH") == GRANTED
                && ContextCompat.checkSelfPermission(c, "android.permission.BLUETOOTH_ADMIN") == GRANTED
                && ContextCompat.checkSelfPermission(c, "android.permission.ACCESS_COARSE_LOCATION") == GRANTED
                && ContextCompat.checkSelfPermission(c, "android.permission.ACCESS_FINE_LOCATION") == GRANTED;
    }


    public static void askForMissingPermissions(Activity context) {
        Intrinsics.checkNotNullParameter(context, "context");

        try {
            boolean z = ContextCompat.checkSelfPermission(context, "android.permission.BLUETOOTH") == GRANTED;
            boolean z2 = ContextCompat.checkSelfPermission(context, "android.permission.BLUETOOTH_ADMIN") == GRANTED;
            boolean z3 = ContextCompat.checkSelfPermission(context, "android.permission.ACCESS_COARSE_LOCATION") == GRANTED;
            boolean z4 = ContextCompat.checkSelfPermission(context, "android.permission.ACCESS_FINE_LOCATION") == GRANTED;
            ArrayList arrayList = new ArrayList();
            if (!z) {
                arrayList.add("android.permission.BLUETOOTH");
            }
            if (!z2) {
                arrayList.add("android.permission.BLUETOOTH_ADMIN");
            }
            if (!z3) {
                arrayList.add("android.permission.ACCESS_COARSE_LOCATION");
            }
            if (!z4) {
                arrayList.add("android.permission.ACCESS_FINE_LOCATION");
            }
            if (Build.VERSION.SDK_INT >= 31) {
                boolean z5 = ContextCompat.checkSelfPermission(context, "android.permission.BLUETOOTH_CONNECT") == GRANTED;
                boolean z6 = ContextCompat.checkSelfPermission(context, "android.permission.BLUETOOTH_SCAN") == GRANTED;
                if (!z5) {
                    arrayList.add("android.permission.BLUETOOTH_CONNECT");
                }
                if (!z6) {
                    arrayList.add("android.permission.BLUETOOTH_SCAN");
                }
            }
            if (!arrayList.isEmpty()) {
                ActivityCompat.requestPermissions(context, (String[]) arrayList.toArray(new String[0]), Constants.BT_PERMISSION);
            }
        } catch (StackOverflowError e) {
            e.printStackTrace();
        }
    }
}
