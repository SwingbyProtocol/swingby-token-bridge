import { extendType, nonNull, stringArg } from 'nexus';
import Web3 from 'web3';

import { prisma } from '../server__env';

export const hasSignedTerms = extendType({
  type: 'Query',
  definition(t) {
    t.boolean('hasSignedTerms', {
      args: {
        address: nonNull(stringArg()),
      },
      async resolve(source, args, ctx, info) {
        const latestMsg = await prisma.termsAgreementMessage.findFirst({
          orderBy: { createdAt: 'desc' },
        });
        if (!latestMsg) {
          return false;
        }

        const web3 = new Web3();
        return !!(await prisma.termsAgreementLog.findUnique({
          where: {
            address_messageId: {
              address: web3.utils.toChecksumAddress(args.address),
              messageId: latestMsg.id,
            },
          },
        }));
      },
    });
  },
});
