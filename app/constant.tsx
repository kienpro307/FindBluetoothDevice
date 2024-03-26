/* eslint-disable prettier/prettier */
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';

export const SCREEN_OPTION_DEFAULT: NativeStackNavigationOptions = {
  headerShown: false,
  statusBarTranslucent: true,
  statusBarColor: 'transparent',
  statusBarStyle: 'dark',
};

export const LANGUAGE_PREFERENCE = 'language_preference';

export const MIN_VALUE = -32768;

export const COLORS = {
  BACK_GROUND: '#2bccff',
  white: '#FFFFFF',
};

export const DEVICE_IMAGES = {
  headphone: require('../assets/logoIcon/headphone.png'),
  headphoneDetail: require('../assets/logoIcon/headphoneDetail.png'),
  headphoneDetect: require('../assets/logoIcon/headphoneDetect.png'),

  pc: require('../assets/logoIcon/pc.png'),
  pcDetail: require('../assets/logoIcon/pcDetail.png'),
  pcDetect: require('../assets/logoIcon/pcDetect.png'),

  phone: require('../assets/logoIcon/phone.png'),
  phoneDetail: require('../assets/logoIcon/phoneDetail.png'),
  phoneDetect: require('../assets/logoIcon/phoneDetect.png'),

  speaker: require('../assets/logoIcon/speaker.png'),
  speakerDetail: require('../assets/logoIcon/speakerDetail.png'),
  speakerDetect: require('../assets/logoIcon/speakerDetect.png'),

  unknown: require('../assets/logoIcon/unknown.png'),
  unknownDetail: require('../assets/logoIcon/unknownDetail.png'),
  unknownDetect: require('../assets/logoIcon/unknownDetect.png'),

  wearable: require('../assets/logoIcon/watch.png'),
  wearableDetail: require('../assets/logoIcon/watchDetail.png'),
  wearableDetect: require('../assets/logoIcon/watchDetect.png'),

  health: require('../assets/logoIcon/health.png'),
  healthDetail: require('../assets/logoIcon/healthDetail.png'),
  healthDetect: require('../assets/logoIcon/healthDetect.png'),

  peripheral: require('../assets/logoIcon/peripheral.png'),
  peripheralDetail: require('../assets/logoIcon/peripheralDetail.png'),
  peripheralDetect: require('../assets/logoIcon/peripheralDetect.png'),

  goBack: require('../assets/goBack.png'),
  filter: require('../assets/filter.png'),
  history: require('../assets/history.png'),
  menu: require('../assets/menu.png'),
  bgWhiteCircle: require('../assets/bgWhiteCircle.png'),
  scanButton: require('../assets/scanButton.png'),
  blanket: require('../assets/blanket.png'),
  logo: require('../assets/logo.png'),
  premium: require('../assets/premium.png'),
  setting: require('../assets/setting.png'),
  scanning: require('../assets/scanning.gif'),
  landingPage: require('../assets/landingPage.png'),
  buttonLeft: require('../assets/buttonLeft.png'),

  rateApp: require('../assets/rateApp.png'),
  hardWork: require('../assets/hardWork.png'),
};

export const OPTIONS = [
  {
    nameDevice: 'pc',
    title: 'Computer Group',
    image: DEVICE_IMAGES.pc,
    select: true,
  },
  {
    nameDevice: 'phone',
    title: 'Phone Group',
    image: DEVICE_IMAGES.phone,
    select: true,
  },
  {
    nameDevice: 'health',
    title: 'Health Group',
    image: DEVICE_IMAGES.health,
    select: true,
  },
  {
    nameDevice: 'wearable',
    title: 'Wearable Group',
    image: DEVICE_IMAGES.wearable,
    select: true,
  },
  {
    nameDevice: 'headphone',
    title: 'Headphone Group',
    image: DEVICE_IMAGES.headphone,
    select: true,
  },
  {
    nameDevice: 'speaker',
    title: 'Speaker Group',
    image: DEVICE_IMAGES.speaker,
    select: true,
  },
  {
    nameDevice: 'peripheral',
    title: 'Peripheral Group',
    image: DEVICE_IMAGES.peripheral,
    select: true,
  },
  {
    nameDevice: 'unknown',
    title: 'Unknown Group',
    image: DEVICE_IMAGES.unknown,
    select: true,
  },
];

export const ADJUST_EVENT = {
  INTER_SHOW: 'm84j0u',
  INTER_DISPLAYED: '9yd1s7',
  BANNER_SHOW: 'vigcdf',
  BANNER_DISPLAYED: 'i7dqyz',
  REWARD_SHOW: 'gyywtt',
  REWARD_DISPLAYED: 'qvvneb',
  OPEN_ADS_SHOW: 'vcezov',
  OPEN_ADS_DISPLAYED: '35sklc',
  NATIVE_ADS_SHOW: 'p2ym11',
  NATIVE_ADS_DISPLAYED: '385eoj',
  INTER_SHOW_CLOSE_POPUP_SUB: 'hbfrqc',
  INTER_DISPLAYED_CLOSE_POPUP_SUB: 'gstrcj',
  REWARD_SHOW_TEXT_COLOR: 'vp9fwj',
  REWARD_DISPLAYED_TEXT_COLOR: 'pect7n',
  REWARD_SHOW_BACKGROUND_COLOR: 'w88cwf',
  REWARD_DISPLAYED_BACKGROUND_COLOR: '57j70g',
  REWARD_SHOW_FONT_STYLE: 'vvoi1r',
  REWARD_DISPLAYED_FONT_STYLE: 'uzsoth',

  START_TRIAL: 'ei2jtb',
  SUB_WEEKLY: '3qtdck',
  SUB_MONTHLY: '2bseu9',
  SUB_YEARLY: 'o0t347',
  TUTORIAL_DONE: '982oom',
};

export const FIREBASE = {
  INTER_SHOW: 'aj_inters_show',
  INTER_DISPLAYED: 'aj_inters_displayed',
  BANNER_SHOW: 'aj_banner_show',
  BANNER_DISPLAYED: 'aj_banner_displayed',
  REWARD_SHOW: 'aj_rewarded_show',
  REWARD_DISPLAYED: 'aj_rewarded_displayed',
  OPEN_ADS_SHOW: 'aj_open_ads_show',
  OPEN_ADS_DISPLAYED: 'aj_open_ads_displayed',
  NATIVE_ADS_SHOW: 'aj_native_show',
  NATIVE_ADS_DISPLAYED: 'aj_native_displayed',

  INTER_SHOW_CLOSE_POPUP_SUB: 'aj_inters_show_close_popup',
  INTER_DISPLAYED_CLOSE_POPUP_SUB: 'aj_inters_displayed_close_popup',
  REWARD_SHOW_TEXT_COLOR: 'aj_reward_show_text_color',
  REWARD_DISPLAYED_TEXT_COLOR: 'aj_inters_displayed_text_color',
  REWARD_SHOW_BACKGROUND_COLOR: 'aj_reward_show_background_color',
  REWARD_DISPLAYED_BACKGROUND_COLOR: 'aj_inters_displayed_background_color',
  REWARD_SHOW_FONT_STYLE: 'aj_reward_show_font_style',
  REWARD_DISPLAYED_FONT_STYLE: 'aj_inters_displayed_font_style',

  START_TRIAL: 'aj_start_trial',
  SUB_WEEKLY: 'aj_subscribe_weekly',
  SUB_MONTHLY: 'aj_subscribe_monthly',
  SUB_YEARLY: 'aj_subscribe_yearly',
  TUTORIAL_DONE: 'aj_tutorial_done',

  SCREEN_TRANSLATE: 'screen_translate',
  RE_SCAN: 're_scan',
  VOICE_TRANSLATE: 'voice_translate',
};

export const LANGUAGE: {[key: string]: {name: string; nativeName: string}} = {
  vi: {
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
  },
  en: {
    name: 'English',
    nativeName: 'English',
  },
};

export const LANGUAGE_TO_COUNTRY_CODE_MAP: {[key: string]: string} = {
  en: 'gb',
  vi: 'vn',
};

export const LANGUAGE_RESOURCE = {
  en: {
    translations: require('./languages/locales/en.json'),
  },
  vi: {
    translations: require('./languages/locales/vi.json'),
  },
};

export const STORAGE = {
  FLOATING_BALL_OPACITY: 'floating_ball_opacity',
  FLOATING_BALL_SIZE: 'floating_ball_size',
  TEXT_COLOR_TRANSLATE: 'text_color_translate',
  BACKGROUND_COLOR_TRANSLATE: 'background_color_translate',
  INDEX_TRANSLATE: 'indexTranslate',
  FONT_STYLE_TRANSLATE: 'font_style_translate',
  IMAGE_BUBBLE: 'image_bubble',
  DEFAULT_IMAGE_BUBBLE: 'default_image_bubble',
  ENABLE_SHAKE: 'enable_shake',
  SENSITIVITY_SHAKE: 'sensitivity_shake',
  NUMBER_TRANSLATE: 'number_translate',
  LAST_SHOW_RATE: 'last_show_rate',
  FIRST_OPEN: 'first_open',
};

export const COLOR = {
  first: '#ff6132',
};