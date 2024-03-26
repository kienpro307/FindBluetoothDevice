/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import {Adjust, AdjustEvent, AdjustConfig} from 'react-native-adjust';
import {isDev} from '../utils';

interface AdjustConfigProviderProps {
  children: React.ReactNode;
}

const AdjustConfigProvider = (props: AdjustConfigProviderProps) => {
  React.useEffect(() => {
    const adjustConfig = new AdjustConfig(
      'teuo9o1na96o',
      isDev()
        ? AdjustConfig.EnvironmentSandbox
        : AdjustConfig.EnvironmentProduction,
    );
    adjustConfig.setLogLevel(AdjustConfig.LogLevelVerbose);
    Adjust.create(adjustConfig);

    return () => {
      Adjust.componentWillUnmount();
    };
  }, []);
  return <>{props.children}</>;
};

export default AdjustConfigProvider;
