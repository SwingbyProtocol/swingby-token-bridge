import React, { useContext, useMemo, useEffect, useState } from 'react';
import { Wallet } from 'bnc-onboard/dist/src/interfaces'; // eslint-disable-line import/no-internal-modules
import { useTheme } from 'styled-components';

import { logger } from '../logger';

import { initOnboard } from './initOnboard';

const Context = React.createContext<{
  address: string | null;
  wallet: Wallet | null;
  onboard: ReturnType<typeof initOnboard> | null;
}>({ address: null, wallet: null, onboard: null });

export const OnboardProvider = ({ children }: { children?: React.ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [network, setNetwork] = useState<number | null>(null);
  const [onboard, setOnboard] = useState<ReturnType<typeof initOnboard> | null>(null);
  const theme = useTheme();

  useEffect(() => {
    try {
      setOnboard(
        initOnboard({
          networkId: (network ?? undefined) as any,
          subscriptions: { address: setAddress, wallet: setWallet, network: setNetwork },
        }),
      );
    } catch (e) {
      logger.debug(e, 'Invalid network selected');
    }
  }, [network]);

  useEffect(() => {
    onboard?.config({ darkMode: theme.pulsar.id !== 'PulsarLight' });
  }, [onboard, theme]);

  const value = useMemo(() => ({ address, wallet, onboard }), [address, wallet, onboard]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useOnboard = () => useContext(Context);
