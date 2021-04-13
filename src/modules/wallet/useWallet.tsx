import { useMemo } from 'react';

import { useInternalContext } from './internal-context';

export const useWallet = () => {
  const { onboard, walletConnect, setModalOpen } = useInternalContext();

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

        return walletConnect.address;
      })(),
    }),
    [onboard, walletConnect, setModalOpen],
  );
};
