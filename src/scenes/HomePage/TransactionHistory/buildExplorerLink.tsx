import { Network } from '../../../generated/graphql';

export const buildExplorerLink = ({ network, hash }: { network: Network; hash: string }) => {
  switch (network) {
    case Network.Ethereum:
      return `https://etherscan.io/tx/${hash}`;
    case Network.Goerli:
      return `https://goerli.etherscan.io/tx/${hash}`;
    case Network.Bsc:
      return `https://bscscan.com/tx/${hash}`;
    case Network.Bsct:
      return `https://testnet.bscscan.com/tx/${hash}`;
  }
};
