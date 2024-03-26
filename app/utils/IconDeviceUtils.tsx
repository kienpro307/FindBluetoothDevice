/* eslint-disable prettier/prettier */
import { DEVICE_IMAGES } from "../constant";

export const deviceIcon = (value: number) => {
  switch (value) {
    case 256:
      return DEVICE_IMAGES.pc;
    case 2304:
      return DEVICE_IMAGES.health;
    case 1280:
      return DEVICE_IMAGES.peripheral;
    case 512:
      return DEVICE_IMAGES.phone;
    case 1792:
      return DEVICE_IMAGES.wearable;
    case 1024:
      return DEVICE_IMAGES.speaker;
    case 2097152:
      return DEVICE_IMAGES.headphone;
    case 7936:
      return DEVICE_IMAGES.unknown;
    default:
      return DEVICE_IMAGES.unknown;
  }
};

export const deviceDetailIcon = (value: number) => {
  switch (value) {
    case 256:
      return DEVICE_IMAGES.pcDetail;
    case 2304:
      return DEVICE_IMAGES.healthDetail;
    case 1280:
      return DEVICE_IMAGES.peripheralDetail;
    case 512:
      return DEVICE_IMAGES.phoneDetail;
    case 1792:
      return DEVICE_IMAGES.wearableDetail;
    case 1024:
      return DEVICE_IMAGES.speakerDetail;
    case 2097152:
      return DEVICE_IMAGES.headphoneDetail;
    case 7936:
      return DEVICE_IMAGES.unknownDetail;
    default:
      return DEVICE_IMAGES.unknownDetail;
  }
};

export const deviceDetectIcon = (value: number) => {
  switch (value) {
    case 256:
      return DEVICE_IMAGES.pcDetect;
    case 2304:
      return DEVICE_IMAGES.healthDetect;
    case 1280:
      return DEVICE_IMAGES.peripheralDetect;
    case 512:
      return DEVICE_IMAGES.phoneDetect;
    case 1792:
      return DEVICE_IMAGES.wearableDetect;
    case 1024:
      return DEVICE_IMAGES.speakerDetect;
    case 2097152:
      return DEVICE_IMAGES.headphoneDetect;
    case 7936:
      return DEVICE_IMAGES.unknownDetect;
    default:
      return DEVICE_IMAGES.unknownDetect;
  }
};

export const deviceType = (value: number) => {
  switch (value) {
    case 256:
      return 'pc';
    case 2304:
      return 'health';
    case 1280:
      return 'peripheral';
    case 512:
      return 'phone';
    case 1792:
      return 'wearable';
    case 1024:
      return 'speaker';
    case 2097152:
      return 'headphone';
    case 7936:
      return 'unknown';
    default:
      return 'unknown';
  }
};

export const deviceTypeName = (value: number) => {
  switch (value) {
    case 256:
      return 'Pc';
    case 2304:
      return 'Health';
    case 1280:
      return 'Peripheral';
    case 512:
      return 'Phone';
    case 1792:
      return 'Wearable';
    case 1024:
      return 'Speaker';
    case 2097152:
      return 'Headphone';
    case 7936:
      return 'Unknown';
    default:
      return 'Unknown';
  }
};