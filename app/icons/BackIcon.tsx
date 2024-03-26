import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function BackIcon(props: SvgProps) {
  return (
    <Svg width={512} height={512} viewBox="0 0 512 512" {...props}>
      <Path d="M411.5 281h-298c-13.81 0-25-11.19-25-25s11.19-25 25-25h298c13.81 0 25 11.19 25 25s-11.19 25-25 25z" />
      <Path d="M227.99 399.25c-6.08 0-12.18-2.21-16.99-6.67L83.5 274.33a25 25 0 01.25-36.89l131-118.25c10.25-9.25 26.06-8.44 35.31 1.81s8.44 26.06-1.81 35.31l-110.72 99.94L245 355.92c10.12 9.39 10.72 25.21 1.33 35.33-4.93 5.31-11.62 8-18.34 8z" />
    </Svg>
  );
}

export default BackIcon;
