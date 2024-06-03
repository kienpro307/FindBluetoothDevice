import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

const heightUnit = responsiveScreenHeight(1);
const widthUnit = responsiveScreenWidth(1);
const fontSizeUnit = responsiveScreenFontSize(1);

export const WIDTH = (value: number) => {
  return widthUnit * value;
};

export const HEIGHT = (value: number) => {
  return heightUnit * value;
};

export const FONTSIZE = (value: number) => {
  return fontSizeUnit * value;
};
