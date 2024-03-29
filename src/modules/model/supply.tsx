import { arg, extendType, nonNull } from 'nexus';
import ABI from 'human-standard-token-abi';
import { Prisma } from '@prisma/client';

import { buildWeb3Instance } from '../server__web3';
import { SB_TOKEN_CONTRACT } from '../swingby-token';
import { prisma, server__ethereumWalletPrivateKey } from '../server__env';
import { NetworkId } from '../onboard';

import { fromNexusNetwork, toNexusNetwork } from './network-conversion';

const getMaxSupply = async ({ network }: { network: NetworkId }): Promise<Prisma.Decimal> => {
  const web3 = buildWeb3Instance({ network });
  const contract = new web3.eth.Contract(ABI, SB_TOKEN_CONTRACT[network]);

  const decimals = await contract.methods.decimals().call();
  return new Prisma.Decimal(await contract.methods.totalSupply().call()).div(`1e${decimals}`);
};

const getWalletBalance = async ({ network }: { network: NetworkId }): Promise<Prisma.Decimal> => {
  const web3 = buildWeb3Instance({ network });
  const contract = new web3.eth.Contract(ABI, SB_TOKEN_CONTRACT[network]);
  const { address } = web3.eth.accounts.privateKeyToAccount(server__ethereumWalletPrivateKey);

  const decimals = await contract.methods.decimals().call();
  return new Prisma.Decimal(await contract.methods.balanceOf(address).call()).div(`1e${decimals}`);
};

const getCirculatingSupply = async ({
  network,
}: {
  network: NetworkId;
}): Promise<Prisma.Decimal> => {
  const maxSupply = await getMaxSupply({ network });
  const hotWalletBalance = await getWalletBalance({ network });

  const teamWalletsTotalBalance =
    (
      await prisma.teamWalletBalances.aggregate({
        where: { network: toNexusNetwork(network) },
        sum: { balance: true },
      })
    ).sum.balance ?? new Prisma.Decimal(0);

  return maxSupply.minus(hotWalletBalance).minus(teamWalletsTotalBalance);
};

export const TokenMaxSupplyInfo = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('tokenMaxSupply', {
      type: 'Decimal',
      args: { network: nonNull(arg({ type: 'Network' })) },
      async resolve(source, args, ctx, info) {
        return getMaxSupply({ network: fromNexusNetwork(args.network) });
      },
    });
  },
});

export const TokenCirculatingSupplyInfo = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('tokenCirculatingSupply', {
      type: 'Decimal',
      args: { network: nonNull(arg({ type: 'Network' })) },
      async resolve(source, args, ctx, info) {
        return getCirculatingSupply({ network: fromNexusNetwork(args.network) });
      },
    });
  },
});

export const BridgeBalanceInfo = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('bridgeBalance', {
      type: 'Decimal',
      args: { network: nonNull(arg({ type: 'Network' })) },
      async resolve(source, args, ctx, info) {
        return getWalletBalance({ network: fromNexusNetwork(args.network) });
      },
    });
  },
});
