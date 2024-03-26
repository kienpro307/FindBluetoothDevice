/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

export function useEventCallback<T, R>(
  func: (v?: T) => R,
  dependencies: any[] = [],
) {
  const refFunc = React.useRef(func);

  const callFunction = React.useCallback((v?: T) => {
    return refFunc.current(v);
  }, []);

  React.useEffect(() => {
    refFunc.current = func;
  }, dependencies);

  return callFunction;
}
