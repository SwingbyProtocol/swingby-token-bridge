import { StatusCodes } from 'http-status-codes';
import { Prisma, Network } from '@prisma/client';

import { createEndpoint } from '../../../../modules/server__api-endpoint';
import { fetcher } from '../../../../modules/fetch';

const BC_TEAM_WALLETS = [
  'bnb1hn8ym9xht925jkncjpf7lhjnax6z8nv24fv2yq',
  'bnb1e82l2pjarhcpgy85mmlq8atuc5stfugaah29rz',
  'bnb10sy32my2tuhlhkcyxqpqtukglfu7cswkrdrmd5',
  'bnb1duw3nm4ehcrpxg9xwxpw9ya0kpuwyk4s7a0fzk',
  'bnb1j2nkv2fe6rn2hur3vf052r00hdnaj27c3lp2w6',
];

export default createEndpoint({
  isSecret: true,
  fn: async ({ res, prisma }) => {
    const failed: typeof BC_TEAM_WALLETS = [];

    for (let i = 0; i < BC_TEAM_WALLETS.length; i++) {
      const address = BC_TEAM_WALLETS[i];

      try {
        const balance = await (async () => {
          const result = (
            await fetcher<{
              balance: Array<{ asset: string; free: string; frozen: string; locked: string }>;
            }>(`https://explorer.binance.org/api/v1/balances/${address}`)
          ).balance.find((it) => it.asset === 'SWINGBY-888');

          if (!result) {
            return new Prisma.Decimal(0);
          }

          return new Prisma.Decimal(result.free).add(result.frozen).add(result.locked);
        })();

        await prisma.teamWalletBalances.upsert({
          where: { network_address: { network: Network.BSC, address } },
          create: { network: Network.BSC, address, balance },
          update: { network: Network.BSC, address, balance },
        });
      } catch (e) {
        failed.push(address);
      }
    }

    res
      .status(failed.length === 0 ? StatusCodes.OK : StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ walletCount: BC_TEAM_WALLETS.length, failed: failed.length });
  },
});
