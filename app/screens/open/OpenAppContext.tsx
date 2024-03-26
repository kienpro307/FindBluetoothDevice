/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

const OpenAppContext = React.createContext<{
  onChangeShouldShowOpenAds: (value: boolean) => void;
}>({
  onChangeShouldShowOpenAds: (value: boolean) => undefined,
});

export const useOpenApp = () => {
  return React.useContext(OpenAppContext);
};

export default OpenAppContext;
