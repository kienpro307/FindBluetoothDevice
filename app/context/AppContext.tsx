// File: AppContext.tsx
import React, {createContext, useContext, useState, ReactNode} from 'react';

interface AppContextProps {
  openRatingModal: boolean;
  setOpenRatingModal: React.Dispatch<React.SetStateAction<boolean>>;
  shareApp: boolean;
  setShareApp: React.Dispatch<React.SetStateAction<boolean>>;
  openMenuModal: boolean;
  setOpenMenuModal: React.Dispatch<React.SetStateAction<boolean>>;
  openPolicy: boolean;
  setOpenPolicy: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({children}) => {
  const [openRatingModal, setOpenRatingModal] = useState(false);
  const [shareApp, setShareApp] = useState(false);
  const [openMenuModal, setOpenMenuModal] = useState(false);
  const [openPolicy, setOpenPolicy] = useState(false);

  const values: AppContextProps = {
    openRatingModal,
    setOpenRatingModal,
    shareApp,
    setShareApp,
    openMenuModal,
    setOpenMenuModal,
    openPolicy,
    setOpenPolicy,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
};
