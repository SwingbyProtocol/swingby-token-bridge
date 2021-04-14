import { NetworkId } from '../onboard';

export const getDestinationNetwork = (originNetwork: NetworkId): NetworkId => {
  switch (originNetwork) {
    case 1:
      return 56;
    case 5:
      return 97;
    case 56:
      return 1;
    case 97:
      return 5;
    default:
      throw new Error(`Invalid network: ${originNetwork}`);
  }
};
