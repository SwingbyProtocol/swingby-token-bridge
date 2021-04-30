import { NexusGenEnums } from '../../../../nexus-typegen';

export const fromNexusNetwork = (network: NexusGenEnums['Network']) => {
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
