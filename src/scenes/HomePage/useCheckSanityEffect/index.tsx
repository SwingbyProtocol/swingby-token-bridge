import { createOrUpdateToast, dismissToast } from '@swingby-protocol/pulsar';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';

import { Network, useSanityCheckQuery } from '../../../generated/graphql';
import { useOnboard } from '../../../modules/onboard';
import { getDestinationNetwork } from '../../../modules/web3';

const TOAST_ID_SANITY_CHECK = 'sanity-check';

export const useCheckSanityEffect = () => {
  const { network } = useOnboard();
  const { formatMessage } = useIntl();
  const { data, error } = useSanityCheckQuery({
    pollInterval: 15000,
    skip: !network,
    variables: {
      network: (() => {
        if (!network) {
          return Network.Ethereum;
        }

        switch (getDestinationNetwork(network)) {
          case 1:
            return Network.Ethereum;
          case 5:
            return Network.Goerli;
          case 56:
            return Network.Bsc;
          case 97:
            return Network.Bsct;
        }
      })(),
    },
  });

  const isOk = data?.sanityCheck || !error;
  useEffect(() => {
    if (data?.sanityCheck || !error) {
      dismissToast({ toastId: TOAST_ID_SANITY_CHECK });
      return;
    }

    createOrUpdateToast({
      toastId: TOAST_ID_SANITY_CHECK,
      content: formatMessage({ id: 'network.sanity-error' }),
      type: 'warning',
    });
  }, [data, error, formatMessage]);

  return { isOk };
};
