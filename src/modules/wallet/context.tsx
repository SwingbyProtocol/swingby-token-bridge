import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { API as OnboardInstance } from 'bnc-onboard/dist/src/interfaces'; // eslint-disable-line import/no-internal-modules
import { useTheme } from 'styled-components';

import { NetworkId } from './networks';
import { useOnboard, OnboardGlobalStyles } from './onboard';
import { useWalletConnect, WalletPicker } from './binance-chain';

type BcWallet = {
  walletSelect: () => Promise<boolean>;
  walletCheck: () => Promise<boolean>;
  walletReset: () => void;
  sign: () => void;
};

const Context = React.createContext<{
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

export const WalletProvider = ({ children }: { children?: React.ReactNode }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const onboard = useOnboard();
  const walletConnect = useWalletConnect();

  const value = useMemo(
    () => ({ onboard, walletConnect, bcWallet: null, isModalOpen, setModalOpen }),
    [onboard, walletConnect, isModalOpen],
  );

  return (
    <>
      <OnboardGlobalStyles />
      <Context.Provider value={value}>
        {children}
        <WalletPicker open={isModalOpen} onClose={() => setModalOpen(false)} />
      </Context.Provider>
    </>
  );
};

export const useWallet = () => {
  const { onboard, walletConnect, setModalOpen } = useContext(Context);

  return useMemo(
    () => ({
      walletReset: () => {
        if (onboard.address) {
          onboard.instance?.walletReset();
        }

        if (walletConnect.instance?.connected) {
          walletConnect.instance?.killSession();
        }
      },
      walletSelect: () => {
        setModalOpen(true);
      },
      address: (() => {
        if (onboard.address) {
          return onboard.address;
        }

        return null;
      })(),
    }),
    [onboard, walletConnect, setModalOpen],
  );
};
