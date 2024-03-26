/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import {REMOTE_KEY, useRemote} from '../remoteConfig/RemoteConfig';
import DeviceInfo from 'react-native-device-info';
import Illustration from './Illustration';
import {Linking} from 'react-native';
import { useTranslation } from 'react-i18next';


interface ContextProviderProps {
  children: React.ReactNode;
}

enum StrategyUpdateType {
  LOW = 0,
  MEDIUM = 1,
  HEIGHT = 2,
}
const UpdateContextProvider = (props: ContextProviderProps) => {
  const {t} = useTranslation();
  const lastVersion = useRemote(REMOTE_KEY.last_version);
  const lastVersionForceUpdate = useRemote(
    REMOTE_KEY.last_version_force_update,
  );
  const lastVersionPriority = useRemote(REMOTE_KEY.last_version_priority);
  const [strategyUpdate, setStrategyUpdate] =
    React.useState<StrategyUpdateType>(StrategyUpdateType.LOW);
  const [showPopupRequiredUpdate, setShowPopupRequiredUpdate] =
    React.useState<boolean>(false);

  const checkIfNeedUpdate = () => {
    DeviceInfo.getVersion;
    const versionCode = Number.parseInt(DeviceInfo.getBuildNumber());

    // console.log('>>> versionCode:', versionCode);
    // console.log(
      // '>>> lastVersionForceUpdate:',
      // lastVersionForceUpdate().asNumber(),
    // );
    // console.log('priority >>>', strategyUpdate);
    if (versionCode < lastVersionForceUpdate().asNumber()) {
      setStrategyUpdate(StrategyUpdateType.HEIGHT);
      console.log('im in force update high');
      update(StrategyUpdateType.HEIGHT);
      return;
    }
    if (versionCode < lastVersion().asNumber()) {
      setStrategyUpdate(lastVersionPriority().asNumber());
      console.log('im in force update medium or high');
      update(lastVersionPriority().asNumber());
      return;
    }
  };

  const onCancel = () => {
    setShowPopupRequiredUpdate(false);
  };

  const update = (priority: number) => {
    console.log('im in update function');
    switch (priority) {
      case StrategyUpdateType.HEIGHT:
      case StrategyUpdateType.MEDIUM: {
        setShowPopupRequiredUpdate(true);
        break;
      }
      default: {
        setShowPopupRequiredUpdate(false);
        break;
      }
    }
  };

  React.useEffect(() => {
    checkIfNeedUpdate();
  }, []);

  // React.useEffect(() => {
  //   update();
  // }, [strategyUpdate]);

  const onUpdate = () => {
    Linking.openURL(
      // '',
      'https://play.google.com/store/apps/details?id=com.flabs.screen.translate',
    );
  };
  return (
    <>
      <Modal statusBarTranslucent transparent visible={showPopupRequiredUpdate}>
        <View
          style={{
            backgroundColor: '#00000090',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: '80%',
              maxWidth: 300,
              backgroundColor: '#fff',
              borderRadius: 15,
              padding: 20,
              gap: 20,
              alignItems: 'center',
            }}>
            <Illustration width={200} height={200} />
            <Text
              style={{
                fontFamily: 'Poppins-Bold',
                color: '#000',
                textAlign: 'center',
                fontSize: 15,
              }}>
              {strategyUpdate === StrategyUpdateType.MEDIUM
                ? t(
                    'The application has a new version. Do you want to update now?',
                  )
                : t(
                    'You need to update to the latest version to use. Please update now!',
                  )}
            </Text>
            <View
              style={{
                justifyContent:
                  strategyUpdate === StrategyUpdateType.HEIGHT
                    ? 'center'
                    : 'space-between',
                flexDirection: 'row',
                width: '100%',
              }}>
              {strategyUpdate === StrategyUpdateType.MEDIUM && (
                <TouchableOpacity
                  onPress={onCancel}
                  style={{
                    backgroundColor: '#fff',
                    paddingVertical: 8,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: '#949494',
                    width: 100,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Bold',
                      color: '#949494',
                      verticalAlign: 'top',
                    }}>
                    {t('Next time')}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={onUpdate}
                style={{
                  backgroundColor: '#0678D6',
                  paddingVertical: 8,
                  borderRadius: 20,
                  width: 100,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Bold',
                    color: '#fff',
                    verticalAlign: 'top',
                  }}>
                  {t('Update')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {props.children}
    </>
  );
};

export default UpdateContextProvider;
