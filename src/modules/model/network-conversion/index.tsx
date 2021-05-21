import type { NexusGenEnums } from '../../../../nexus-typegen';
import type { NetworkId } from '../../onboard';

type Network = NexusGenEnums['Network'];

export const fromNexusNetwork = (network: Network): NetworkId => {
  switch (network) {
    case 'ETHEREUM':
      return 1;
    case 'GOERLI':
      return 5;
    case 'BSC':
      return 56;
    case 'BSCT':
      return 97;
    default:
      throw new Error(`Invalid network: ${network}`);
  }
};

export const toNexusNetwork = (network: NetworkId): Network => {
  switch (network) {
    case 1:
      return 'ETHEREUM';
    case 5:
      return 'GOERLI';
    case 56:
      return 'BSC';
    case 97:
      return 'BSCT';
    default:
      throw new Error(`Invalid network: ${network}`);
  }
};
