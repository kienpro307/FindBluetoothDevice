/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  NativeEventEmitter,
  Dimensions,
  Modal,
  ScrollView,
  ActivityIndicator,
  GestureResponderHandlers,
  PanResponderInstance,
  PanResponder,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {FontFamily, Color, FontSize, Border} from '../../GlobalStyles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {BluetoothDeviceInfo} from '../../type';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {rssi2Meter} from '../../utils/DistanceUtils';
import {COLOR, COLORS, DEVICE_IMAGES, MIN_VALUE} from '../../constant';
import BluetoothModule from '../../native.module.android/BluetoothModule';
import ScanContext from '../../context/ScanContext';
import {dictionary2Trans} from '../../utils/LanguageUtils';
import RNSpeedometer from '../../components/chart/speedometer';
import {deviceDetectIcon} from '../../utils/IconDeviceUtils';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {BannerAdSize} from 'react-native-google-mobile-ads';
import BannerAdWrap from '../../ads/BannerAdWrap';
import NativeAdsShow from '../../ads/NativeAdsShow';
// import {REMOTE_KEY, useRemote} from '../../remoteConfig/RemoteConfig';
import {useAds} from '../../ads/AdsContext';
import {firebaseSendEvent} from '../../firebase/FirebaseUtiils';
import {useOpenApp} from '../open/OpenAppContext';
import {REMOTE_KEY, useRemote} from '../../remoteConfig/RemoteConfig';

import {LogBox} from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message

// ================================ COMPASS ==================================

import {SafeAreaView} from 'react-native-safe-area-context';
import {
  magnetometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import Svg, {Circle, Line, Path, Text as SvgText} from 'react-native-svg';
import {isStrictNever} from '../../utils/StrictUtils';
import {startCounter, stopCounter} from 'react-native-accurate-step-counter';
import {FONTSIZE, HEIGHT, WIDTH} from '../../utils/ResponseDimensionUtils';

type CompassDirection =
  | 'North'
  | 'North-East'
  | 'East'
  | 'South-East'
  | 'South'
  | 'South-West'
  | 'West'
  | 'North-West';

const getCompassDirection = (angle: number): CompassDirection => {
  if (angle >= 337.5 || angle < 22.5) return 'North';
  if (angle >= 22.5 && angle < 67.5) return 'North-East';
  if (angle >= 67.5 && angle < 112.5) return 'East';
  if (angle >= 112.5 && angle < 157.5) return 'South-East';
  if (angle >= 157.5 && angle < 202.5) return 'South';
  if (angle >= 202.5 && angle < 247.5) return 'South-West';
  if (angle >= 247.5 && angle < 292.5) return 'West';
  if (angle >= 292.5 && angle < 337.5) return 'North-West';
  return isStrictNever(angle as never); // impossible to get here
};

// ============================= DECARTES 2D PLANES ===========================

// x and y axis start from top-left
type Position = {
  x: number;
  y: number;
};

const ARROW_LENGTH = WIDTH(20); // 1/5 screen
const COMPASS_RADIUS = WIDTH(25); // 1/4 screen
const normalizedPosition: Position = {
  x: WIDTH(50),
  y: HEIGHT(15),
};

// type ButtonsProps = {
//   move: (dx: number, dy: number) => void;
//   rotate: (transitionAngle: number) => void;
//   resetStep: () => void;
// };

// const Buttons = React.memo<ButtonsProps>(({ move, rotate, resetStep }) => {
//   useEffect(() => {
//     console.log('Buttons are rendered!');
//   }, []);

//   return (
//     <View
//       style={[
//         styles.redBorder,
//         {
//           width: '100%',
//           height: 'auto',
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',

//           flexWrap: 'wrap'
//           // columnGap: 10 // test,
//         }
//       ]}
//     >
//       <TouchableOpacity
//         style={[styles.buttonContainer, styles.redBorder]}
//         onPress={e => move(0, -20)}
//       >
//         <Text>Up</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={[styles.buttonContainer, styles.redBorder]}
//         onPress={e => move(0, 20)}
//       >
//         <Text>Down</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={[styles.buttonContainer, styles.redBorder]}
//         onPress={e => move(-20, 0)}
//       >
//         <Text>Left</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={[styles.buttonContainer, styles.redBorder]}
//         onPress={e => move(20, 0)}
//       >
//         <Text>Right</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[
//           styles.buttonContainer,
//           styles.redBorder,
//           { flexBasis: '33.3%' }
//         ]}
//         onPress={e => rotate(-Math.PI / 10)}
//       >
//         <Text>RotateLeft</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[
//           styles.buttonContainer,
//           styles.redBorder,
//           { flexBasis: '33.3%' }
//         ]}
//         onPress={e => rotate(Math.PI / 10)}
//       >
//         <Text>RotateRight</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[
//           styles.buttonContainer,
//           styles.redBorder,
//           { flexBasis: '33.3%' }
//         ]}
//         onPress={e => resetStep()}
//       >
//         <Text>Reset Step</Text>
//       </TouchableOpacity>

//       {/* Workaround for flex wrap */}
//       {/* <View
//         style={{ flexGrow: 999, flexShrink: 1, flexBasis: 'auto' }}
//       /> */}
//     </View>
//   );
// });

// const styles = StyleSheet.create({
//   buttons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '80%'
//   },
//   redBorder: {
//     borderColor: 'red',
//     borderWidth: 1
//   },
//   buttonContainer: {
//     flexGrow: 1,
//     flexShrink: 0,
//     flexBasis: '25%',
//     alignItems: 'center', // centered text
//     paddingVertical: 10
//   }
// });

type PointInfo = {
  position: Position;
  length: number;
  angle: number;
  direction: Position;
};

type Plane2DProps = {
  syncCompassPointInfo: PointInfo;
  panHandlers: GestureResponderHandlers | undefined;
  compassAngle: number;
};

const getRadAngle = (
  compassAngle: number,
  compassDirection: CompassDirection,
) => {
  switch (compassDirection) {
    case 'East':
      return compassAngle;
    case 'North-East':
      return compassAngle + Math.PI / 4;
    case 'North':
      return compassAngle + Math.PI / 2;
    case 'North-West':
      return compassAngle + (3 * Math.PI) / 4;
    case 'West':
      return compassAngle + Math.PI;
    case 'South-West':
      return compassAngle - (3 * Math.PI) / 4;
    case 'South':
      return compassAngle - Math.PI / 2;
    case 'South-East':
      return compassAngle - Math.PI / 4;
    default:
      return isStrictNever(compassDirection);
  }
};

const Plane2D: React.FC<Plane2DProps> = ({
  syncCompassPointInfo,
  panHandlers,
  compassAngle,
}) => {
  const getCompassPoint = (compassDirection: CompassDirection): Position => {
    return {
      x: COMPASS_RADIUS * Math.cos(getRadAngle(compassAngle, compassDirection)),
      y:
        -COMPASS_RADIUS * Math.sin(getRadAngle(compassAngle, compassDirection)), // Y inverted
    };
  };

  const eastPoint = getCompassPoint('East');
  const northEastPoint = getCompassPoint('North-East');
  const northPoint = getCompassPoint('North');
  const northWestPoint = getCompassPoint('North-West');
  const westPoint = getCompassPoint('West');
  const southWestPoint = getCompassPoint('South-West');
  const southPoint = getCompassPoint('South');
  const southEastPoint = getCompassPoint('South-East');

  // NOTE: for now on, only print syncCompassPointInfo
  // direction arrow head
  const arrowheadLength = 20;
  const arrowheadAngle = Math.PI / 6;
  const transition = {
    x: Math.cos(syncCompassPointInfo.angle) * arrowheadLength,
    y: Math.sin(syncCompassPointInfo.angle) * arrowheadLength,
  };

  const x2 = transition.x + syncCompassPointInfo.position.x;
  const y2 = transition.y + syncCompassPointInfo.position.y;
  const x3 =
    x2 -
    arrowheadLength * Math.cos(syncCompassPointInfo.angle + arrowheadAngle);
  const y3 =
    y2 -
    arrowheadLength * Math.sin(syncCompassPointInfo.angle + arrowheadAngle);
  const x4 =
    x2 -
    arrowheadLength * Math.cos(syncCompassPointInfo.angle - arrowheadAngle);
  const y4 =
    y2 -
    arrowheadLength * Math.sin(syncCompassPointInfo.angle - arrowheadAngle);

  return (
    <Svg width={WIDTH(100)} height={HEIGHT(32)} {...panHandlers}>
      {/* X-axis */}
      <Line
        x1={WIDTH(15)}
        y1={HEIGHT(15)}
        x2={WIDTH(85)}
        y2={HEIGHT(15)}
        stroke={Color.colorDeepskyblue}
        strokeWidth={WIDTH(1)}
      />

      {/* X text */}
      {/* <SvgText
        x={WIDTH(85)}
        y={HEIGHT(14)}
        fill={Color.colorBlue}
        fontSize={FONTSIZE(2.5)}
        fontWeight="bold"
        textAnchor="middle">
        X
      </SvgText> */}

      {/* Y-axis */}
      <Line
        x1={WIDTH(50)}
        y1={HEIGHT(0)}
        x2={WIDTH(50)}
        y2={HEIGHT(30)}
        stroke={Color.colorDeepskyblue}
        strokeWidth={WIDTH(1)}
      />

      {/* Y text */}
      {/* <SvgText
        x={WIDTH(54)}
        y={HEIGHT(2)}
        fill={Color.colorBlue}
        fontSize={FONTSIZE(2.5)}
        fontWeight="bold"
        textAnchor="middle">
        Y
      </SvgText> */}

      {/* Compass */}
      <Circle
        cx={normalizedPosition.x}
        cy={normalizedPosition.y}
        r={COMPASS_RADIUS}
        strokeWidth={WIDTH(1)}
        stroke={Color.colorRed}
        fill={'transparent'}
      />
      <Circle
        cx={normalizedPosition.x + eastPoint.x}
        cy={normalizedPosition.y + eastPoint.y}
        r={WIDTH(0.5)}
        stroke={Color.colorBlack}
        strokeWidth={WIDTH(1)}
        fill={Color.colorBlack}
      />
      <Circle
        cx={normalizedPosition.x + northEastPoint.x}
        cy={normalizedPosition.y + northEastPoint.y}
        r={WIDTH(0.5)}
        stroke={Color.colorBlack}
        strokeWidth={WIDTH(1)}
        fill={Color.colorBlack}
      />
      <Circle
        cx={normalizedPosition.x + northPoint.x}
        cy={normalizedPosition.y + northPoint.y}
        r={WIDTH(0.5)}
        stroke={Color.colorBlack}
        strokeWidth={WIDTH(1)}
        fill={Color.colorBlack}
      />
      <Circle
        cx={normalizedPosition.x + northWestPoint.x}
        cy={normalizedPosition.y + northWestPoint.y}
        r={WIDTH(0.5)}
        stroke={Color.colorBlack}
        strokeWidth={WIDTH(1)}
        fill={Color.colorBlack}
      />
      <Circle
        cx={normalizedPosition.x + westPoint.x}
        cy={normalizedPosition.y + westPoint.y}
        r={WIDTH(0.5)}
        stroke={Color.colorBlack}
        strokeWidth={WIDTH(1)}
        fill={Color.colorBlack}
      />
      <Circle
        cx={normalizedPosition.x + southWestPoint.x}
        cy={normalizedPosition.y + southWestPoint.y}
        r={WIDTH(0.5)}
        stroke={Color.colorBlack}
        strokeWidth={WIDTH(1)}
        fill={Color.colorBlack}
      />
      <Circle
        cx={normalizedPosition.x + southPoint.x}
        cy={normalizedPosition.y + southPoint.y}
        r={WIDTH(0.5)}
        stroke={Color.colorBlack}
        strokeWidth={WIDTH(1)}
        fill={Color.colorBlack}
      />
      <Circle
        cx={normalizedPosition.x + southEastPoint.x}
        cy={normalizedPosition.y + southEastPoint.y}
        r={WIDTH(0.5)}
        stroke={Color.colorBlack}
        strokeWidth={WIDTH(1)}
        fill={Color.colorBlack}
      />

      <SvgText
        x={normalizedPosition.x + eastPoint.x + WIDTH(4)}
        y={normalizedPosition.y + eastPoint.y}
        fill={Color.colorBlack}
        textAnchor={'middle'}
        fontSize={FONTSIZE(2)}>
        E
      </SvgText>

      <SvgText
        x={normalizedPosition.x + northEastPoint.x + WIDTH(2)}
        y={normalizedPosition.y + northEastPoint.y - HEIGHT(1)}
        fill={Color.colorBlack}
        textAnchor={'middle'}
        fontSize={FONTSIZE(2)}>
        NE
      </SvgText>

      <SvgText
        x={normalizedPosition.x + northPoint.x}
        y={normalizedPosition.y + northPoint.y - HEIGHT(1)}
        fill={'red'}
        textAnchor={'middle'}
        fontSize={FONTSIZE(2.5)}
        fontWeight={'bold'}>
        N
      </SvgText>

      <SvgText
        x={normalizedPosition.x + northWestPoint.x - WIDTH(2)}
        y={normalizedPosition.y + northWestPoint.y - HEIGHT(1)}
        fill={Color.colorBlack}
        textAnchor={'middle'}
        fontSize={FONTSIZE(2)}>
        NW
      </SvgText>

      <SvgText
        x={normalizedPosition.x + westPoint.x - WIDTH(4)}
        y={normalizedPosition.y + westPoint.y}
        fill={Color.colorBlack}
        textAnchor={'middle'}
        fontSize={FONTSIZE(2)}>
        W
      </SvgText>

      <SvgText
        x={normalizedPosition.x + southWestPoint.x - WIDTH(2)}
        y={normalizedPosition.y + southWestPoint.y + HEIGHT(2)}
        fill={Color.colorBlack}
        textAnchor={'middle'}
        fontSize={FONTSIZE(2)}>
        SW
      </SvgText>

      <SvgText
        x={normalizedPosition.x + southPoint.x}
        y={normalizedPosition.y + southPoint.y + HEIGHT(3)}
        fill={Color.colorBlack}
        textAnchor={'middle'}
        fontSize={FONTSIZE(2)}>
        S
      </SvgText>

      <SvgText
        x={normalizedPosition.x + southEastPoint.x + WIDTH(2)}
        y={normalizedPosition.y + southEastPoint.y + HEIGHT(2)}
        fill={Color.colorBlack}
        textAnchor={'middle'}
        fontSize={FONTSIZE(2)}>
        SE
      </SvgText>

      {/* Arrow body */}
      <Line
        x1={normalizedPosition.x}
        y1={normalizedPosition.y}
        x2={normalizedPosition.x + syncCompassPointInfo.position.x}
        y2={normalizedPosition.y + syncCompassPointInfo.position.y}
        stroke={Color.colorRed}
        strokeWidth={WIDTH(3)}
      />

      {/* Arrow head */}
      <Path
        d={`M${normalizedPosition.x + x2},${normalizedPosition.y + y2} L${
          normalizedPosition.x + x3
        },${normalizedPosition.y + y3} L${normalizedPosition.x + x4},${
          normalizedPosition.y + y4
        } Z`}
        fill={Color.colorRed}
      />

      {/* O point */}
      <Circle
        cx={normalizedPosition.x}
        cy={normalizedPosition.y}
        r={WIDTH(1)}
        stroke={Color.colorDeepskyblue}
        strokeWidth={WIDTH(4)}
        fill={Color.colorDeepskyblue}
      />
      {/* O text */}
      {/* <SvgText
        x={normalizedPosition.x - WIDTH(2)}
        y={normalizedPosition.y + HEIGHT(3)}
        fill={Color.colorDeepskyblue}
        fontSize={FONTSIZE(2.5)}
        fontWeight={'bold'}
        textAnchor="middle">
        O
      </SvgText> */}
    </Svg>
  );
};

const initialPoint: PointInfo = {
  position: {
    x: WIDTH(10),
    y: -HEIGHT(20),
  },
  angle: Math.atan2(
    normalizedPosition.x + WIDTH(2),
    normalizedPosition.y - HEIGHT(3),
  ),
  length: Math.sqrt(
    (normalizedPosition.x + WIDTH(2)) ** 2 +
      (normalizedPosition.y - HEIGHT(3)) ** 2,
  ),
  direction: {
    x: WIDTH(10) / Math.sqrt(WIDTH(10) ** 2 + (-HEIGHT(20)) ** 2),
    y: -HEIGHT(20) / Math.sqrt(WIDTH(10) ** 2 + (-HEIGHT(20)) ** 2),
  },
};

const Navigation = () => {
  const [pointInfo, setPointInfo] = useState<PointInfo>(initialPoint);
  const [syncCompassPointInfo, setSyncCompassPointInfo] =
    useState<PointInfo>(initialPoint);
  const [compassAngle, setCompassAngle] = useState<number>(0);
  const [normalizedCompassAngle, setNormalizedCompassAngle] =
    useState<number>(0);
  const [compassDirection, setCompassDirection] =
    useState<CompassDirection>('North');
  const [steps, setSteps] = useState(0);

  // ============================================================================

  const getDirection = useCallback((position: Position) => {
    const vector = {x: position.x, y: position.y};

    const magnitude = Math.sqrt(vector.x ** 2 + vector.y ** 2);

    const normalizedVector = {
      x: vector.x / magnitude,
      y: vector.y / magnitude,
    };

    return normalizedVector;
  }, []);

  const getLength = useCallback((position: Position) => {
    return Math.sqrt(position.x ** 2 + position.y ** 2);
  }, []);

  const getAngle = useCallback((direction: Position) => {
    return Math.atan2(direction.y, direction.x);
  }, []);

  const panResponder = useRef<PanResponderInstance | null>(null);

  useEffect(() => {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: e => {
        const newTempPosition = {
          x: e.nativeEvent.locationX - normalizedPosition.x,
          y: e.nativeEvent.locationY - normalizedPosition.y,
        };
        const newDirection = getDirection(newTempPosition);
        const newAngle = getAngle(newTempPosition);
        const newLength = ARROW_LENGTH;
        const newPosition = {
          x: newLength * Math.cos(newAngle),
          y: newLength * Math.sin(newAngle),
        };
        const newPointInfo = {
          position: newPosition,
          direction: newDirection,
          angle: newAngle,
          length: newLength,
        };

        setPointInfo(newPointInfo);
      },
    });
  }, [getDirection, getAngle, getLength]);

  const move = (dx: number, dy: number) => {
    setPointInfo(prevPointInfo => {
      const newPosition = {
        x: prevPointInfo.position.x + dx,
        y: prevPointInfo.position.y + dy,
      };
      const newDirection = getDirection(newPosition);
      const newAngle = getAngle(newDirection);
      const newLength = getLength(newPosition);

      return {
        position: newPosition,
        direction: newDirection,
        angle: newAngle,
        length: newLength,
      };
    });
  }; // no recreate when Plane2D changed => no rerender Buttons

  const rotate = (transitionAngle: number) => {
    setPointInfo(prevPointInfo => {
      const newAngle = prevPointInfo.angle + transitionAngle;
      const newPosition = {
        x: prevPointInfo.length * Math.cos(newAngle),
        y: prevPointInfo.length * Math.sin(newAngle),
      };
      const newDirection = getDirection(newPosition);
      const newLength = getLength(newPosition);

      return {
        position: newPosition,
        angle: newAngle,
        direction: newDirection,
        length: newLength,
      };
    });
  };

  // initiate compass and step counter
  useEffect(() => {
    // compass
    const subscription = magnetometer.subscribe(({x, y, z, timestamp}) => {
      // const denormalizedAngle = Math.atan2(y, x) * (180 / Math.PI);
      // const normalizedAngle =
      //   denormalizedAngle >= 0 ? denormalizedAngle : denormalizedAngle + 360;
      const denormalizedAngle = Math.atan2(y, x);
      const normalizedAngle =
        denormalizedAngle >= 0
          ? denormalizedAngle
          : denormalizedAngle + 2 * Math.PI;
      setCompassAngle(normalizedAngle);
      setCompassDirection(getCompassDirection(normalizedAngle));
      setUpdateIntervalForType(SensorTypes.magnetometer, 500); // 500ms per update
    });

    // step counter
    const config = {
      default_threshold: 20.0, // best result experiment
      default_delay: 400000000, // best result experiment
      cheatInterval: 3000,
      onStepCountChange: (stepCount: any) => {
        setSteps(stepCount);
      },
      onCheat: () => {
        console.log('You are moving too fast, slow down for best accuracy!');
      },
    };
    startCounter(config);

    return () => {
      subscription.unsubscribe(); // compass
      stopCounter(); // step counter
    };
  }, []);

  // reset syncNormalizedCompassAngle each time pointInfo changed
  useEffect(() => {
    setNormalizedCompassAngle(compassAngle);
  }, [pointInfo]);

  // update arrow each time compassAngle or normalizedCompassAngle changed
  useEffect(() => {
    const newAngle = pointInfo.angle - compassAngle + normalizedCompassAngle;
    console.log(
      'Compass Angle',
      compassAngle,
      'Normalized Compass Angle',
      normalizedCompassAngle,
    );
    const newPosition = {
      x: ARROW_LENGTH * Math.cos(newAngle),
      y: ARROW_LENGTH * Math.sin(newAngle),
    };
    const newDirection = getDirection(newPosition);
    const newLength = getLength(newDirection);
    const newSyncCompassPointInfo = {
      angle: newAngle,
      position: newPosition,
      direction: newDirection,
      length: newLength,
    };
    setSyncCompassPointInfo(newSyncCompassPointInfo);
    // don't update original point here
  }, [normalizedCompassAngle, compassAngle]);

  return (
    <Plane2D
      syncCompassPointInfo={syncCompassPointInfo}
      panHandlers={panResponder.current?.panHandlers}
      compassAngle={compassAngle}
    />
    // <View
    //   style={{
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //   }}>
    //   <Text
    //     style={{
    //       fontSize: 20,
    //       fontWeight: 'bold',
    //     }}>
    //     Angle: {compassAngle.toFixed(2)}°
    //   </Text>
    //   <Text
    //     style={{
    //       fontSize: 20,
    //       fontWeight: 'bold',
    //     }}>
    //     Direction: {compassDirection}
    //   </Text>

    //   <Text
    //     style={{
    //       fontSize: 20,
    //       fontWeight: 'bold',
    //     }}>
    //     Steps: {steps}. Distance: {steps * 0.5}m
    //   </Text>
    // </View>
  );
};

// import { DirectCard } from '../../components/DirectCard';

const windowWidth = Dimensions.get('window').width;
const transparent = 'rgba(0,0,0,0.5)';

const DetectDevice: React.FC = ({navigation}: any) => {
  // const numberReScanShowAds = useRemote(REMOTE_KEY.re_scan_number_free);
  const ads = useAds();
  const openAds = useOpenApp();
  const isFocused = useIsFocused();
  const {isScanning} = React.useContext(ScanContext);
  const route = useRoute<any>();
  const [device, setDevice] = React.useState<BluetoothDeviceInfo | undefined>(
    undefined,
  );
  const [listHistory, setListHistory] = React.useState<
    Array<{rssi: number; distance: string; time: number}>
  >([]);

  const [openModal, setOpenModal] = React.useState(false);
  const [checkHistory, setCheckHistory] = React.useState(false);
  const [lengthHistory, setLengthHistory] = React.useState(0);
  const [isNotFound, setIsNotFound] = React.useState(false);
  const [numberReScan, setNumberReScan] = React.useState<number>(1);
  const numberReScanShowAds = useRemote(REMOTE_KEY.re_scan_number_free);

  const handleFindDevice = (device: BluetoothDeviceInfo | undefined) => {
    setNumberReScan(numberReScan + 1);
    if (numberReScan % (numberReScanShowAds().asNumber() + 4) === 0) {
      ads.showInter().then(() => {
        if (device) BluetoothModule.findDevice(device);
        openAds.onChangeShouldShowOpenAds(false);
      });
    } else {
      if (device) BluetoothModule.findDevice(device);
    }
  };

  function renderModal(ads?: React.ReactNode) {
    return (
      <Modal
        statusBarTranslucent
        animationType="fade"
        visible={openModal}
        transparent={true}>
        <View
          onTouchEnd={() => setOpenModal(false)}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: transparent,
          }}>
          <View
            onTouchEnd={e => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              paddingHorizontal: 15,
              paddingBottom: 20,
              width: '90%',
              borderRadius: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxHeight: '60%',
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                }}></View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 40,
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 16,
                    fontWeight: '700',
                  }}>
                  {dictionary2Trans('History')}
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 40,
                  height: 40,
                  // backgroundColor: 'red',
                }}
                onPress={() => setOpenModal(false)}>
                <FontAwesomeIcon name="close" size={25} color={'red'} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {listHistory.map(item => renderItemsHistory(item))}
            </ScrollView>
            <View
              style={[styles.adNative, {width: '100%', paddingVertical: 0}]}>
              {ads}
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  function NotFoundModal() {
    return (
      <Modal visible={isNotFound} transparent={true}>
        <View
          onTouchEnd={() => setIsNotFound(false)}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: transparent,
          }}>
          <View
            onTouchEnd={e => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              padding: 15,
              width: '90%',
              borderRadius: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 15,
                fontWeight: '500',
                textAlign: 'center',
              }}>
              {dictionary2Trans("can't find device")}
            </Text>
            <TouchableOpacity
              onPress={() => setIsNotFound(false)}
              style={{
                borderWidth: 1,
                width: 80,
                height: 30,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'blue',
                marginTop: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: Color.colorWhite,
                  fontFamily: FontFamily.khulaBold,
                  fontWeight: '600',
                }}>
                {dictionary2Trans('confirm')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  React.useEffect(() => {
    if (route.params && route.params.item !== undefined) {
      const item = route.params.item;
      setDevice(item);
    }
  }, [route.params]);

  const add2History = (item: BluetoothDeviceInfo) => {
    const distanceValue = rssi2Meter(item ? item.rssi : MIN_VALUE);
    // console.log('distance value', distanceValue);
    setListHistory(old => [
      {
        rssi: item.rssi,
        distance: distanceValue > 5 ? '> 5m' : '\u2248 ' + distanceValue + 'm',
        time: item.lastDiscovered,
      },
      ...old,
    ]);
  };

  React.useEffect(() => {
    const eventEmitter = new NativeEventEmitter();
    const eventDeviceFoundListener = eventEmitter.addListener(
      'event_tracking_device',
      (data: BluetoothDeviceInfo) => {
        // console.log('tracking');
        // console.log(data);
        setDevice(data);
        add2History(data);
      },
    );
    return () => {
      eventDeviceFoundListener.remove();
    };
  }, []);

  React.useEffect(() => {
    if (isScanning && !checkHistory) {
      setCheckHistory(true);
    } else if (checkHistory) {
      setCheckHistory(false);
      if (listHistory.length === lengthHistory) {
        setIsNotFound(true);
      }
      setLengthHistory(listHistory.length);
    }
  }, [isScanning]);

  const renderItemsHistory = (item: any) => {
    const dateObject = new Date(parseInt(item.time));
    // Định dạng thời gian
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    });
    const formattedTime = timeFormatter.format(dateObject);

    // Định dạng ngày
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const formattedDate = dateFormatter.format(dateObject);

    return (
      <View
        key={item.time}
        style={{
          width: windowWidth * 0.8,
          height: 75,
          margin: 2,
          justifyContent: 'center',

          borderBottomWidth: 1, // Thêm đường kẻ ngăn cách
          borderBottomColor: 'grey', // Màu sắc của đường kẻ ngăn cách
        }}>
        <Text style={{color: 'black', fontSize: 16}}>RSSI: {item.rssi}</Text>
        <Text style={{color: 'black', fontSize: 16}}>
          {dictionary2Trans('Distance')}: {item.distance}
        </Text>
        <Text style={{color: 'black', fontSize: 16}}>
          {dictionary2Trans('Time')}: {formattedTime} {formattedDate}
        </Text>
      </View>
    );
  };

  React.useEffect(() => {
    if (route.params && route.params.item !== undefined) {
      const item = route.params.item;
      handleFindDevice(item);
      // console.log('>>> im find device: ', device);
    }
  }, [isFocused]);

  //const [openModal, setOpenModal] = React.useState(false);
  const [direction, setDirection] = React.useState('North');

  return (
    <View style={styles.detectDeviceScreen}>
      <LinearGradient
        style={styles.navbar}
        locations={[0.9, 1]}
        colors={['#109bff', 'rgba(30, 160, 255, 0.6)']}
        useAngle={true}
        angle={180}>
        <View style={styles.frame}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: 40,
              height: 40,
              justifyContent: 'flex-end',

              // backgroundColor: 'red',
            }}>
            <Image
              style={styles.vectorIcon1}
              resizeMode="cover"
              source={DEVICE_IMAGES.goBack}
            />
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.detectDevice}>
              {dictionary2Trans('Detect Device')}
            </Text>
          </View>
          <View style={{width: 40, height: 40}} />
        </View>
      </LinearGradient>

      <View style={styles.historyButtonBar}>
        <View style={styles.deviceinfo}>
          {device && (
            <Image
              style={styles.deviceinfoChild}
              resizeMode="cover"
              source={deviceDetectIcon(device.deviceClass)}
            />
          )}

          <View style={styles.deviceinfoText}>
            <Text style={styles.deviceName}>{device?.name}</Text>
            <Text style={styles.deviceDetail}>{device?.address}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => setOpenModal(true)}>
          <Image
            style={styles.historyIcon}
            resizeMode="cover"
            source={DEVICE_IMAGES.history}
          />
        </TouchableOpacity>
      </View>
      <View style={{display: 'flex', height: hp('29%')}}>
        <RNSpeedometer
          value={rssi2Meter(device ? device.rssi : MIN_VALUE)}
          minValue={0}
          size={wp('80%')}
        />
      </View>

      {/* My tricks */}
      <View>
        {isScanning && true && false ? (
          <ActivityIndicator size="large" />
        ) : (
          <View style={{width: '100%', height: 'auto', display: 'flex'}}>
            <Navigation />
          </View>
        )}
      </View>

      {/* <Text style={styles.distanceText}>{device?.rssi}</Text> */}
      <View style={{display: 'flex'}}>
        <Text style={styles.guideText}>
          {dictionary2Trans('go_around_to_update_distance')}
        </Text>
      </View>
      <View style={[styles.ad, styles.adLayout]} />
      <View style={[styles.adNative]}>
        <NativeAdsShow size="small" repository="simple" />
      </View>
      {isScanning ? (
        <TouchableOpacity style={styles.buttonFind}>
          <Text style={{color: 'white', fontSize: 20}}>
            {dictionary2Trans('Scanning...')}
          </Text>
          <ActivityIndicator
            color={'white'}
            size={30}
            style={{marginLeft: 5}}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.buttonFind}
          onPress={() => handleFindDevice(device)}>
          <Text style={{color: 'white', fontSize: 20}}>
            {dictionary2Trans('Re-Scan')}
          </Text>
        </TouchableOpacity>
      )}
      {renderModal(<NativeAdsShow size="small" repository="simple" />)}
      {NotFoundModal()}

      <View style={styles.ad}>
        <BannerAdWrap size={BannerAdSize.BANNER} position="bottom" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  adLayout: {
    width: 328,
    position: 'absolute',
    overflow: 'hidden',
  },
  amyLayout: {
    height: 17,
    width: 171,
    textAlign: 'left',
  },
  vectorIcon1: {
    width: 11,
    height: 18,
  },
  frame: {
    width: '100%',
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detectDevice: {
    fontSize: FontSize.size_lg_2,
    width: 147,
    height: 22,
    textAlign: 'center',
    color: Color.colorWhite,
    fontFamily: FontFamily.khulaBold,
    fontWeight: '700',
    marginTop: 20,
  },
  ad: {
    bottom: 0,
    height: 50,
    overflow: 'hidden',
    width: '100%',
    left: 0,
    position: 'absolute',
  },
  adNative: {
    // width: '90%',
    // bottom: 55,
    // overflow: 'hidden',
    // left: '5%',
    // position: 'absolute',
    // maxHeight: 150,
    width: '90%',
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    paddingVertical: 10,
  },
  distanceText: {
    fontSize: 46,
    color: Color.colorBlack,
    fontFamily: FontFamily.khulaBold,
    fontWeight: '700',
    marginTop: 20,
  },
  guideText: {
    fontSize: 15,
    color: Color.colorBlack,
    fontFamily: FontFamily.khulaBold,
    fontWeight: '400',
    marginHorizontal: 20,
    textAlign: 'center',
  },
  historyButtonBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  historyButton: {
    backgroundColor: Color.colorDeepskyblue,
    borderRadius: 11,
    overflow: 'visible',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    width: 40,
    height: 40,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 1,
  },
  historyIcon: {
    width: 30,
    height: 30,
  },
  navbar: {
    borderBottomRightRadius: 21,
    borderBottomLeftRadius: 21,
    height: hp('13%'),
    backgroundColor: 'transparent',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  deviceinfoChild: {
    borderRadius: Border.br_3xs_1,
    width: 33,
    height: 33,
    overflow: 'hidden',
  },
  deviceName: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: FontFamily.khulaSemiBold,
    color: Color.colorBlack,
  },
  deviceDetail: {
    fontSize: 11,
    fontFamily: FontFamily.khulaRegular,
    marginTop: 2.73,
    color: Color.colorBlack,
  },
  deviceinfoText: {
    width: '100%',
    height: 36,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingRight: 8,
    marginLeft: 15,
    overflow: 'hidden',
  },
  deviceinfo: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: Color.colorLightcyan,
    height: 47,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 5,
    overflow: 'hidden',
    marginRight: 12,
  },
  detectDeviceScreen: {
    borderRadius: 1,
    backgroundColor: Color.colorWhite,
    borderStyle: 'solid',
    borderColor: Color.colorGray,
    borderWidth: 0.3,
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonFind: {
    borderWidth: 1,
    width: 200,
    height: 55,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    display: 'flex',
    flexDirection: 'row',
  },
});

export default DetectDevice;
