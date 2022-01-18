import Onboard from 'bnc-onboard';

import { blocknativeApiKey, infuraApiKey, walletConnectBridge } from '../env';

import type { Subscriptions } from 'bnc-onboard/dist/src/interfaces'; // eslint-disable-line import/no-internal-modules

const appName = 'Swingby Bridge';
const appUrl = 'https://bridge.swingby.network';

const RPC_URLS = {
  1: `https://mainnet.infura.io/v3/${infuraApiKey}`,
  5: `https://goerli.infura.io/v3/${infuraApiKey}`,
  56: 'https://bsc-dataseed1.binance.org:443',
  97: 'https://data-seed-prebsc-1-s1.binance.org:8545',
} as const;

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

  const wallets = [
    { walletName: 'metamask', preferred: true },
    {
      walletName: 'walletConnect',
      bridge: walletConnectBridge,
      preferred: true,
      rpc: RPC_URLS,
    },
    {
      walletName: 'ledger',
      rpcUrl,
      preferred: true,
    },
    { walletName: 'walletLink', rpcUrl, appName, preferred: true },
    { walletName: 'authereum' },
    { walletName: 'lattice', rpcUrl, appName },
    { walletName: 'torus' },
    { walletName: 'opera' },
    {
      walletName: 'trezor',
      email: 'info@swingby.network',
      appUrl: appName,
      rpcUrl,
    },
  ];

  return Onboard({
    dappId: blocknativeApiKey,
    networkId,
    hideBranding: true,
    subscriptions,
    walletSelect: {
      wallets,
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
