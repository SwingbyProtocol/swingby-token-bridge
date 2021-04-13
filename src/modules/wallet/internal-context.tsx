import React, { useContext } from 'react';

import { useOnboard } from './onboard';
import { useWalletConnect } from './binance-chain';

export const WalletInternalContext = React.createContext<{
  onboard: ReturnType<typeof useOnboard>;
  walletConnect: ReturnType<typeof useWalletConnect>;
  bcWallet: null;
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}>({
  onboard: null,
  walletConnect: null,
  bcWallet: null,
  isModalOpen: false,
  setModalOpen: () => {},
} as any);

export const useInternalContext = () => useContext(WalletInternalContext);
