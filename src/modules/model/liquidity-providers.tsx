import { extendType, objectType, nonNull, list } from 'nexus';

export const LiquidityProvider = objectType({
  name: 'LiquidityProvider',
  definition(t) {
    t.string('id');
  },
});

export const LiquidityProviderQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('liquidityProviders', {
      type: nonNull(list(nonNull(LiquidityProvider))),
      async resolve(source, args, ctx, info) {
        return ctx.prisma.liquidityProvider.findMany();
      },
    });
  },
});
