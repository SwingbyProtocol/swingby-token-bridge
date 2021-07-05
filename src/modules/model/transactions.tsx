import { extendType, objectType, arg, inputObjectType, enumType } from 'nexus';

import { paginate, paginatedType, paginationArgs } from '../pagination';

import { fromGraphWhereArgToPrisma } from './fromGraphWhereArgToPrisma';

export const Deposit = objectType({
  name: 'Deposit',
  definition(t) {
    t.nonNull.id('id', {
      resolve(source, args, context, info) {
        return Buffer.from(`${source.network}__${source.hash}`, 'utf-8').toString('base64');
      },
    });

    t.model.network();
    t.model.hash();
    t.model.blockNumber();
    t.model.transactionIndex();
    t.model.at();
    t.model.addressContract();
    t.model.addressFrom();
    t.model.addressTo();
    t.model.gas();
    t.model.gasPrice();
    t.model.tokenDecimals();
    t.model.value();
    t.model.createdAt();
    t.model.updatedAt();

    t.model.payments();
    t.model.crashes();
  },
});

export const Payment = objectType({
  name: 'Payment',
  definition(t) {
    t.nonNull.id('id', {
      resolve(source, args, context, info) {
        return Buffer.from(`${source.network}__${source.hash}`, 'utf-8').toString('base64');
      },
    });

    t.model.network();
    t.model.hash();
    t.model.blockNumber();
    t.model.transactionIndex();
    t.model.at();
    t.model.addressContract();
    t.model.addressFrom();
    t.model.addressTo();
    t.model.gas();
    t.model.gasPrice();
    t.model.tokenDecimals();
    t.model.value();
    t.model.createdAt();
    t.model.updatedAt();

    t.model.status();
    t.model.deposit();
  },
});

export const PaymentCrash = objectType({
  name: 'PaymentCrash',
  definition(t) {
    t.nonNull.id('id');
    t.model.reason();
    t.model.deposit();
  },
});

export const PaymentStatus = enumType({
  name: 'PaymentStatus',
  members: ['PENDING', 'COMPLETED', 'FAILED'],
});

const PaymentWhereInput = inputObjectType({
  name: 'PaymentWhereInput',
  definition(t) {
    t.list.field('AND', { type: 'PaymentWhereInput' });
    t.list.field('NOT', { type: 'PaymentWhereInput' });
    t.list.field('OR', { type: 'PaymentWhereInput' });

    t.field('network', { type: 'NetworkFilter' });
    t.field('hash', { type: 'StringFilter' });
    t.field('status', { type: 'PaymentStatusFilter' });
    t.field('blockNumber', { type: 'DecimalFilter' });
    t.field('transactionIndex', { type: 'IntFilter' });
    t.field('at', { type: 'DateTimeFilter' });
    t.field('addressContract', { type: 'StringFilter' });
    t.field('addressFrom', { type: 'StringFilter' });
    t.field('addressTo', { type: 'StringFilter' });
    t.field('gas', { type: 'DecimalFilter' });
    t.field('gasPrice', { type: 'DecimalFilter' });
    t.field('tokenDecimals', { type: 'IntFilter' });
    t.field('value', { type: 'DecimalFilter' });
    t.field('createdAt', { type: 'DateTimeFilter' });
    t.field('updatedAt', { type: 'DateTimeFilter' });
  },
});

const PaymentRelationWhereInput = inputObjectType({
  name: 'PaymentRelationWhereInput',
  definition(t) {
    t.field('every', { type: PaymentWhereInput });
    t.field('none', { type: PaymentWhereInput });
    t.field('some', { type: PaymentWhereInput });
  },
});

const DepositWhereInput = inputObjectType({
  name: 'DepositWhereInput',
  definition(t) {
    t.list.field('AND', { type: 'DepositWhereInput' });
    t.list.field('NOT', { type: 'DepositWhereInput' });
    t.list.field('OR', { type: 'DepositWhereInput' });

    t.field('network', { type: 'NetworkFilter' });
    t.field('hash', { type: 'StringFilter' });
    t.field('blockNumber', { type: 'DecimalFilter' });
    t.field('transactionIndex', { type: 'IntFilter' });
    t.field('at', { type: 'DateTimeFilter' });
    t.field('addressContract', { type: 'StringFilter' });
    t.field('addressFrom', { type: 'StringFilter' });
    t.field('addressTo', { type: 'StringFilter' });
    t.field('gas', { type: 'DecimalFilter' });
    t.field('gasPrice', { type: 'DecimalFilter' });
    t.field('tokenDecimals', { type: 'IntFilter' });
    t.field('value', { type: 'DecimalFilter' });
    t.field('createdAt', { type: 'DateTimeFilter' });
    t.field('updatedAt', { type: 'DateTimeFilter' });
    t.field('payments', { type: PaymentRelationWhereInput });
  },
});

export const DepositsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('deposits', {
      type: paginatedType({ nodeType: 'Deposit', alias: 'Deposits' }),
      args: {
        where: arg({
          type: DepositWhereInput,
          description: 'Allows to filter results by several properties.',
        }),
        ...paginationArgs,
      },
      async resolve(source, args, ctx, info) {
        return paginate({
          ...args,
          id: ['network', 'hash'],
          allEdges: await ctx.prisma.deposit.findMany({
            where: fromGraphWhereArgToPrisma(args.where),
            include: { payments: true, crashes: true },
            orderBy: { at: 'desc' },
          }),
        });
      },
    });
  },
});
