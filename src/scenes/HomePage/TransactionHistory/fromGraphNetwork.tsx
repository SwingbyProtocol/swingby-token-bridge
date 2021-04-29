import { Network } from '../../../generated/graphql';
import type { NetworkId } from '../../../modules/onboard';

export const fromGraphNetwork = (network: Network): NetworkId => {
  switch (network) {
    case Network.Ethereum:
      return 1;
    case Network.Goerli:
      return 5;
    case Network.Bsc:
      return 56;
    case Network.Bsct:
      return 97;
  }
};
