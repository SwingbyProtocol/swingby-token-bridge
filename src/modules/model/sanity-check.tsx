import { extendType, arg, nonNull } from 'nexus';

import { Network } from '../../generated/graphql';
import { assertPaymentSanityCheck } from '../server__payment-sanity-check';

export const SanityCheckQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('sanityCheck', {
      type: 'Boolean',
      args: { network: nonNull(arg({ type: 'Network' })) },
      async resolve(source, args, ctx, info) {
        const network = (() => {
          switch (args.network) {
            case Network.Ethereum:
              return 1;
            case Network.Goerli:
              return 5;
            case Network.Bsc:
              return 56;
            case Network.Bsct:
              return 97;
            default:
              throw new Error(`Invalid network: ${args.network}`);
          }
        })();

        await assertPaymentSanityCheck({ network });
        return true;
      },
    });
  },
});
