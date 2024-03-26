/* eslint-disable prettier/prettier */
export const rssi2Meter = (rssi: number) => {
  if (rssi > -40) {
    return 0;
  } else if (rssi > -45) {
    return 0.5;
  } else if (rssi > -50) {
    return 1;
  } else if (rssi > -55) {
    return 2;
  } else if (rssi > -62) {
    return 3;
  } else if (rssi > -65) {
    return 4;
  } else if (rssi > -70) {
    return 5;
  } else {
    return 9;
  }
};
