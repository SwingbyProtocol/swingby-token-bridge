import { useEffect, useMemo, useState } from 'react';
import { API as OnboardInstance } from 'bnc-onboard/dist/src/interfaces'; // eslint-disable-line import/no-internal-modules
import { useTheme } from 'styled-components';

import { isValidNetworkId } from '../networks';

import { initOnboard } from './initOnboard';

export const useOnboard = () => {
  const [updateCount, setUpdateCount] = useState(0);
  const theme = useTheme();

  const instance = useMemo((): OnboardInstance | null => {
    if (typeof window === 'undefined') {
      return null;
    }

    const forceRender = async () => {
      setUpdateCount((value) => (value >= Number.MAX_SAFE_INTEGER ? 0 : value + 1));

      const network = instance?.getState().network;
      if (isValidNetworkId(network)) {
        instance?.config({ networkId: network });
        return;
      }

      if (instance?.getState().wallet?.provider) {
        return await instance?.walletCheck();
      }

      if (await instance?.walletSelect()) {
        await instance?.walletCheck();
      } else {
        await instance?.walletReset();
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
    instance?.config({ darkMode: theme.pulsar.id !== 'PulsarLight' });
  }, [instance, theme]);

  return useMemo(() => {
    const wallet = instance?.getState().wallet ?? null;
    return {
      updateCount,
      address: instance?.getState().address ?? null,
      wallet: wallet?.provider ? wallet : null,
      instance,
      network: instance?.getState().network ?? null,
    };
  }, [instance, updateCount]);
};
