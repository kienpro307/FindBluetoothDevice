/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
export const BANNER_ID = 'ca-app-pub-1939315010587936/7026513129';
export const REWARD_ID = 'ca-app-pub-1939315010587936/5437319039';
export const INTER_ID = 'ca-app-pub-1939315010587936/9840378722';
export const NATIVE_ID = 'ca-app-pub-1939315010587936/6499899517';
export const OPEN_ID = 'ca-app-pub-1939315010587936/5487884953';

export const getPlacementId = (dev: string, pro: string) => {
  return process.env.NODE_ENV === 'development' ? dev : pro;
};
