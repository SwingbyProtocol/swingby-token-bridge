import React, { useContext, useMemo, useEffect, useState } from 'react';
import { Wallet, API as OnboardInstance } from 'bnc-onboard/dist/src/interfaces'; // eslint-disable-line import/no-internal-modules
import { useTheme } from 'styled-components';

import { initOnboard, isValidNetworkId } from './initOnboard';

const Context = React.createContext<{
  address: string | null;
  wallet: Wallet | null;
  network: number | null;
  onboard: OnboardInstance | null;
}>({ address: null, wallet: null, network: null, onboard: null });

export const OnboardProvider = ({ children }: { children?: React.ReactNode }) => {
  const [updateCount, setUpdateCount] = useState(0);
  const theme = useTheme();

  const onboard = useMemo((): OnboardInstance | null => {
    if (typeof window === 'undefined') {
      return null;
    }

    const forceRender = async () => {
      setUpdateCount((value) => (value >= Number.MAX_SAFE_INTEGER ? 0 : value + 1));

      const network = onboard?.getState().network;
      if (isValidNetworkId(network)) {
        onboard?.config({ networkId: network });
        return;
      }

      if (onboard?.getState().wallet?.provider) {
        return await onboard?.walletCheck();
      }

      if (await onboard?.walletSelect()) {
        await onboard?.walletCheck();
      } else {
        await onboard?.walletReset();
      }
    };

    return initOnboard({
      subscriptions: {
        address: forceRender,
        wallet: forceRender,
        network: forceRender,
        balance: forceRender,
      },
    });
  }, []);

  useEffect(() => {
    onboard?.config({ darkMode: theme.pulsar.id !== 'PulsarLight' });
  }, [onboard, theme]);

  const value = useMemo(() => {
    const wallet = onboard?.getState().wallet ?? null;
    return {
      updateCount,
      address: onboard?.getState().address ?? null,
      wallet: wallet?.provider ? wallet : null,
      onboard,
      network: onboard?.getState().network ?? null,
    };
  }, [onboard, updateCount]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useOnboard = () => useContext(Context);
