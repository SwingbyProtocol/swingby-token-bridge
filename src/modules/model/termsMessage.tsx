import { ApolloError } from 'apollo-server-errors';
import { extendType, objectType } from 'nexus';

import { prisma } from '../server__env';

const Message = objectType({
  name: 'Message',
  definition(t) {
    t.nonNull.string('message');
    t.nonNull.string('seed');
  },
});

export const termsMessage = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('termsMessage', {
      type: Message,
      async resolve(source, args, ctx, info) {
        const data = await prisma.termsAgreementMessage.findFirst({
          orderBy: { createdAt: 'desc' },
        });
        if (!data) throw new ApolloError("Can't found the latest message");

        return {
          message: data.message,
          seed: data.seed,
        };
      },
    });
  },
});
