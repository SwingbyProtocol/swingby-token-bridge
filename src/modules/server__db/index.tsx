import { Network } from '@prisma/client';

import { NetworkId } from '../onboard';

export const toDbNetwork = (networkId: NetworkId): Network => {
  switch (networkId) {
    case 1:
      return Network.ETHEREUM;
    case 5:
      return Network.GOERLI;
    case 56:
      return Network.BSC;
    case 97:
      return Network.BSCT;
  }
};

export const fromDbNetwork = (network: Network): NetworkId => {
  switch (network) {
    case Network.ETHEREUM:
      return 1;
    case Network.GOERLI:
      return 5;
    case Network.BSC:
      return 56;
    case Network.BSCT:
      return 97;
  }
};
