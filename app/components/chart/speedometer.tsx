/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {Component} from 'react';
import {View, Image, Animated, Easing, Text} from 'react-native';
import PropTypes from 'prop-types';

// Utils
import calculateDegreeFromLabels from './utils/calculate-degree-from-labels';
import calculateLabelFromValue from './utils/calculate-label-from-value';
import limitValue from './utils/limit-value';
import validateSize from './utils/validate-size';

// Style
import style, {width as deviceWidth} from './style';

interface SpeedometerProps {
  value: number;
  defaultValue: number;
  size?: number;
  minValue?: number;
  maxValue?: number;
  easeDuration?: number;
  allowedDecimals?: number;
  labels?: {
    name: string;
    labelColor: string;
    activeBarColor: string;
  }[];
  needleImage?: any;
  bgImage?: any;
  wrapperStyle?: object;
  outerCircleStyle?: object;
  halfCircleStyle?: object;
  imageWrapperStyle?: object;
  imageStyle?: object;
  innerCircleStyle?: object;
  labelWrapperStyle?: object;
  labelStyle?: object;
  labelNoteStyle?: object;
  useNativeDriver?: boolean;
}

class Speedometer extends Component<SpeedometerProps> {
  private speedometerValue: Animated.Value;

  constructor(props: SpeedometerProps) {
    super(props);
    this.speedometerValue = new Animated.Value(props.defaultValue || 0);
  }

  render() {
    const {
      value,
      size,
      minValue,
      maxValue,
      easeDuration,
      allowedDecimals,
      labels,
      needleImage,
      bgImage,
      wrapperStyle,
      outerCircleStyle,
      halfCircleStyle,
      imageWrapperStyle,
      imageStyle,
      innerCircleStyle,
      labelWrapperStyle,
      labelStyle,
      labelNoteStyle,
      useNativeDriver,
    } = this.props;

    const degree = 180;
    const perLevelDegree = calculateDegreeFromLabels(degree, labels || []);
    const label = calculateLabelFromValue(
      limitValue(value, minValue || 0, maxValue || 0, allowedDecimals || 0),
      labels || [],
      minValue || 0,
      maxValue || 0,
    );

    Animated.timing(this.speedometerValue, {
      toValue: limitValue(
        value,
        minValue || 0,
        maxValue || 0,
        allowedDecimals || 0,
      ),
      duration: easeDuration || 500,
      easing: Easing.linear,
      useNativeDriver: useNativeDriver || false,
    }).start();

    const rotate = this.speedometerValue.interpolate({
      inputRange: [minValue || 0, maxValue || 0],
      outputRange: ['-100deg', '100deg'],
    });

    const currentSize = validateSize(size || 0, deviceWidth - 20);

    return (
      <View
        style={[
          style.wrapper,
          {
            width: currentSize,
            height: currentSize / 2,
          },
          wrapperStyle || {},
        ]}>
        <View
          style={[
            {
              justifyContent: 'flex-end',
              alignItems: 'center',
              display: 'flex',
              //   overflow: 'hidden',
              width: currentSize,
              height: currentSize / 2,
              borderTopLeftRadius: currentSize / 2,
              borderTopRightRadius: currentSize / 2,
            },
            outerCircleStyle || {},
          ]}>
          <Image
            style={[
              style.image,
              style.outerCircle,
              {
                zIndex: 0,
                width: currentSize,
                height: currentSize,
                position: 'absolute',
              },
              imageStyle || {},
            ]}
            source={bgImage}
          />
          <Animated.View
            style={[
              style.imageWrapper,
              {
                top: -currentSize / 15,
                transform: [{rotate}],
              },
              imageWrapperStyle || {},
            ]}>
            <Image
              style={[
                style.image,
                {
                  zIndex: 2,
                  width: currentSize,
                  height: currentSize,
                },
                imageStyle || {},
              ]}
              source={needleImage}
            />
          </Animated.View>
          <View
            style={[
              style.innerCircle,
              {
                zIndex: 1,
                width: currentSize * 0.7,
                height: (currentSize / 2) * 0.7,
                borderTopLeftRadius: currentSize / 2,
                borderTopRightRadius: currentSize / 2,
              },
              innerCircleStyle || {},
            ]}
          />
        </View>
        <View style={[style.labelWrapper, labelWrapperStyle || {}]}>
          {/* <Text style={[style.label, labelStyle || {}]}>
            {limitValue(
              value,
              minValue || 0,
              maxValue || 0,
              allowedDecimals || 0,
            )}
          </Text> */}
          <Text
            style={[
              style.labelNote,
              {color: label.labelColor},
              labelNoteStyle || {},
            ]}>
            {label.name}m
          </Text>
        </View>
      </View>
    );
  }

  static defaultProps: SpeedometerProps = {
    defaultValue: 0,
    minValue: 0,
    maxValue: 6,
    easeDuration: 500,
    allowedDecimals: 0,
    labels: [
      {
        name: '0',
        labelColor: '#67b926',
        activeBarColor: '#67b926',
      },
      {
        name: '\u2248 1',
        labelColor: '#67b926',
        activeBarColor: '#67b926',
      },
      {
        name: '\u2248 2',
        labelColor: '#91ba1e',
        activeBarColor: '#91ba1e',
      },
      {
        name: '\u2248 3',
        labelColor: '#f5e842',
        activeBarColor: '#f5e842',
      },
      {
        name: '\u2248 4',
        labelColor: '#ffb701',
        activeBarColor: '#ffb701',
      },
      {
        name: '\u2248 5',
        labelColor: '#e55401',
        activeBarColor: '#e55401',
      },
      {
        name: '\u2248 5+ ',
        labelColor: '#cb271d',
        activeBarColor: '#cb271d',
      },
    ],
    needleImage: require('../../../assets/speedometer-needle.png'),
    bgImage: require('../../../assets/bgImage.png'),
    wrapperStyle: {},
    outerCircleStyle: {},
    halfCircleStyle: {},
    imageWrapperStyle: {},
    imageStyle: {},
    innerCircleStyle: {},
    labelWrapperStyle: {},
    labelStyle: {},
    labelNoteStyle: {},
    useNativeDriver: true,
    value: 0,
  };
}

export default Speedometer;
