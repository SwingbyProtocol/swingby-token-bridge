import { extendType, objectType } from 'nexus';
import ABI from 'human-standard-token-abi';
import { Prisma } from '@prisma/client';

import { buildWeb3Instance } from '../server__web3';
import { SB_TOKEN_CONTRACT } from '../swingby-token';
import { server__ethereumWalletPrivateKey } from '../server__env';
import { NetworkId } from '../onboard';

const getSupply = async ({ network }: { network: NetworkId }): Promise<Prisma.Decimal> => {
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

export const TokenSupplyInfo = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('tokenSupply', {
      type: objectType({
        name: 'TokenSupplyInfo',
        definition(t) {
          t.decimal('supplyEthereum', {
            async resolve() {
              return getSupply({ network: 1 });
            },
          });
          t.decimal('supplyBsc', {
            async resolve() {
              return getSupply({ network: 56 });
            },
          });
          t.decimal('bridgeBalanceEthereum', {
            async resolve() {
              return getWalletBalance({ network: 1 });
            },
          });
          t.decimal('bridgeBalanceBsc', {
            async resolve() {
              return getWalletBalance({ network: 56 });
            },
          });
        },
      }),
      async resolve(source, args, ctx, info) {
        return {};
      },
    });
  },
});
