/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import {Text, View, StyleSheet, Modal} from 'react-native';
import {Bounce} from 'react-native-animated-spinkit';

interface ModalLoadingAdsProps {
  visible: boolean;
}

const ModalLoadingAds = (props: ModalLoadingAdsProps) => {
  return (
    <Modal visible={props.visible} statusBarTranslucent transparent>
      <View
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#00000090',
          gap: 10,
        }}>
        <Bounce size={50} color="#fff" />
      </View>
    </Modal>
  );
};

export default ModalLoadingAds;

const styles = StyleSheet.create({
  container: {},
});
