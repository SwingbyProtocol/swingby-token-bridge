import Onboard from 'bnc-onboard';
import type { Subscriptions } from 'bnc-onboard/dist/src/interfaces'; // eslint-disable-line import/no-internal-modules

import { blocknativeApiKey, infuraApiKey } from '../env';

const appName = 'Swingby Bridge';
const appUrl = 'https://bridge.swingby.network';

const RPC_URLS = {
  1: `https://mainnet.infura.io/v3/${infuraApiKey}`,
  5: `https://goerli.infura.io/v3/${infuraApiKey}`,
  56: 'https://bsc-dataseed1.binance.org:443',
  97: 'https://data-seed-prebsc-1-s1.binance.org:8545',
} as const;

export const isValidNetworkId = (value: any): value is keyof typeof RPC_URLS =>
  !!Object.keys(RPC_URLS).find((it) => `${it}` === `${value}`);

export const initOnboard = ({
  networkId = 1,
  subscriptions,
}: {
  networkId?: keyof typeof RPC_URLS;
  subscriptions: Subscriptions;
}) => {
  const rpcUrl = RPC_URLS[networkId];
  if (!rpcUrl) {
    throw new Error(`Could not find RPC URL for network ID: "${networkId}"`);
  }

  return Onboard({
    dappId: blocknativeApiKey,
    networkId,
    hideBranding: true,
    subscriptions,
    walletSelect: {
      wallets: [
        { walletName: 'metamask', preferred: true, rpcUrl, appName, appUrl },
        { walletName: 'ledger', preferred: true, rpcUrl, appUrl, appName },
        ...(infuraApiKey
          ? [
              {
                walletName: 'walletConnect',
                infuraKey: infuraApiKey,
                preferred: true,
                rpcUrl,
                appUrl,
                appName,
              },
            ]
          : []),
        { walletName: 'walletLink', preferred: true, rpcUrl, appUrl, appName },
        { walletName: 'authereum', rpcUrl, appUrl, appName },
        { walletName: 'lattice', rpcUrl, appUrl, appName },
        { walletName: 'torus', rpcUrl, appUrl, appName },
        { walletName: 'opera', rpcUrl, appUrl, appName },
        { walletName: 'trezor', rpcUrl, appUrl, appName },
      ],
    },
    walletCheck: [
      { checkName: 'derivationPath' },
      { checkName: 'connect' },
      { checkName: 'accounts' },
      { checkName: 'network' },
      { checkName: 'balance', minimumBalance: '100000' },
    ],
  });
};
