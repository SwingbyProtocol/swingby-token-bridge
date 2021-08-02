import WalletConnectProvider from '@walletconnect/web3-provider';
import { WalletModule } from 'bnc-onboard/dist/src/interfaces'; // eslint-disable-line
import { infuraApiKey } from '../../../env';

import { walletConnectBSCLogo } from './logo';

export const walletConnectBsc: WalletModule = {
  name: 'WalletConnect BSC',
  iconSrc: walletConnectBSCLogo,
  iconSrcSet: walletConnectBSCLogo,
  svg: walletConnectBSCLogo,
  wallet: async () => {
    const POLLING_INTERVAL = 12000;
    const bscRpcUrl = 'https://bsc-dataseed1.binance.org:443';
    const bridge = 'https://pancakeswap.bridge.walletconnect.org/';

    const provider = new WalletConnectProvider({
      rpc: {
        1: `https://mainnet.infura.io/v3/${infuraApiKey}`,
        56: bscRpcUrl,
      },
      bridge,
      pollingInterval: POLLING_INTERVAL,
      chainId: 56,
    });

    return {
      provider,
      interface: {
        name: 'WalletConnect',
        connect: () =>
          new Promise((resolve, reject) => {
            provider
              .enable()
              .then(resolve)
              .catch(() =>
                reject({
                  message: 'This dapp needs access to your account information.',
                }),
              );
          }),
        address: {
          onChange: (func) => {
            provider
              .send('eth_accounts')
              .then((accounts: string[]) => accounts[0] && func(accounts[0]));
            provider.on('accountsChanged', (accounts: string[]) => func(accounts[0]));
          },
        },
        network: {
          onChange: (func) => {
            provider.send('eth_chainId').then(func);
            provider.on('chainChanged', func);
          },
        },
        balance: {
          get: async () => {
            // Memo: No function to check the balance. Return 1 to bypass the error
            return 1;
          },
        },
        disconnect: () => {
          provider.wc.killSession();
          provider.stop();
        },
      },
    };
  },
  type: 'sdk',
  link: 'https://walletconnect.org/',
  desktop: true,
  mobile: true,
  preferred: true,
};
