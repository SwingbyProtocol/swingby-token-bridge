import { extendType, arg, nonNull } from 'nexus';

import { assertPaymentSanityCheck } from '../server__payment-sanity-check';

import { fromNexusNetwork } from './network-conversion';

export const SanityCheckQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('sanityCheck', {
      type: 'Boolean',
      args: { network: nonNull(arg({ type: 'Network' })) },
      async resolve(source, args, ctx, info) {
        const network = fromNexusNetwork(args.network);
        await assertPaymentSanityCheck({ network });
        return true;
      },
    });
  },
});
