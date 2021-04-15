import Web3 from 'web3';

import { server__infuraProjectId, server__infuraProjectSecret } from '../env';
import { NetworkId } from '../onboard';

export const buildWeb3Instance = ({ network }: { network: NetworkId }) => {
  const url = (() => {
    switch (network) {
      case 1:
        return `https://:${server__infuraProjectSecret}@mainnet.infura.io/v3/${server__infuraProjectId}`;
      case 5:
        return `https://:${server__infuraProjectSecret}@goerli.infura.io/v3/${server__infuraProjectId}`;
      case 56:
        return 'https://bsc-dataseed1.binance.org:443';
      case 97:
        return 'https://data-seed-prebsc-1-s1.binance.org:8545';
      default:
        throw new Error(`Cannot find a Web3 provider for network "${network}"`);
    }
  })();

  return new Web3(new Web3.providers.HttpProvider(url));
};

export const getScanApiUrl = ({ network }: { network: NetworkId }) => {
  switch (network) {
    case 1:
      return 'https://api.etherscan.io/api';
    case 5:
      return 'https://api-goerli.etherscan.io/api';
    case 56:
      return 'https://api.bscscan.com/api';
    case 97:
      return 'https://api-testnet.bscscan.com/api';
    default:
      throw new Error(`Cannot find a scan API endpoint for network "${network}"`);
  }
};
