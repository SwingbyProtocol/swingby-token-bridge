import React, { useMemo, useState } from 'react';

import { useOnboard, OnboardGlobalStyles } from './onboard';
import { useWalletConnect } from './binance-chain';
import { WalletPicker } from './WalletPicker';
import { WalletInternalContext } from './internal-context';

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
      <WalletInternalContext.Provider value={value}>
        {children}
        <WalletPicker open={isModalOpen} onClose={() => setModalOpen(false)} />
      </WalletInternalContext.Provider>
    </>
  );
};
