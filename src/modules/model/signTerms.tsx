import { extendType, nonNull, stringArg } from 'nexus';
import Web3 from 'web3';

import { prisma } from '../server__env';

export const signTerms = extendType({
  type: 'Mutation',
  definition(t) {
    t.boolean('signTerms', {
      args: {
        address: nonNull(stringArg()),
        signature: nonNull(stringArg()),
      },
      async resolve(source, args, ctx, info) {
        const latestMsg = await prisma.termsAgreementMessage.findFirst({
          orderBy: { createdAt: 'desc' },
        });
        if (!latestMsg) {
          return false;
        }

        const web3 = new Web3();
        return !!(await prisma.termsAgreementLog.upsert({
          where: {
            address_messageId: {
              address: web3.utils.toChecksumAddress(args.address),
              messageId: latestMsg.id,
            },
          },
          update: {
            signature: args.signature,
          },
          create: {
            address: web3.utils.toChecksumAddress(args.address),
            signature: args.signature,
            messageId: latestMsg.id,
          },
        }));
      },
    });
  },
});
