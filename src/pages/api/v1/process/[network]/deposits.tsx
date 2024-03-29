import { StatusCodes } from 'http-status-codes';
import { stringifyUrl } from 'query-string';
import { Prisma, Deposit } from '@prisma/client';
import { DateTime } from 'luxon';

import { server__ethereumWalletPrivateKey } from '../../../../../modules/server__env';
import { fetcher } from '../../../../../modules/fetch';
import { createEndpoint } from '../../../../../modules/server__api-endpoint';
import { buildWeb3Instance, getScanApiUrl } from '../../../../../modules/server__web3';
import { SB_TOKEN_CONTRACT } from '../../../../../modules/swingby-token';
import { toDbNetwork } from '../../../../../modules/server__db';
import { MIN_CONFIRMATIONS_EXPECTED } from '../../../../../modules/web3';

type ApiResult = {
  result?: Array<{
    blockNumber: string;
    timeStamp: string;
    hash: string;
    to: string;
    from: string;
    value: string;
    tokenDecimal: string;
    contractAddress: string;
    gas: string;
    gasPrice: string;
    transactionIndex: string;
    confirmations: string;
  }> | null;
};

export default createEndpoint({
  isSecret: true,
  logId: 'process/deposits',
  fn: async ({ req, res, network, prisma, logger }) => {
    const web3 = buildWeb3Instance({ network });
    const { address: hotWalletAddress } = web3.eth.accounts.privateKeyToAccount(
      server__ethereumWalletPrivateKey,
    );

    const liquitidyProviders = (await prisma.liquidityProvider.findMany()).map((it) =>
      it.address.toLowerCase(),
    );
    logger.debug({ liquitidyProviders }, 'Got list of liquidity providers');

    const lastBlock =
      (
        await prisma.deposit.findFirst({
          where: {
            network: { equals: toDbNetwork(network) },
            addressTo: { equals: hotWalletAddress, mode: 'insensitive' },
          },
          orderBy: { blockNumber: 'desc' },
        })
      )?.blockNumber ?? new Prisma.Decimal(1);
    logger.debug('Will start looking from block %s', lastBlock);

    const depositTxs = (
      (
        await fetcher<ApiResult>(
          stringifyUrl({
            url: getScanApiUrl({ network }),
            query: {
              module: 'account',
              action: 'tokentx',
              address: hotWalletAddress,
              contractaddress: SB_TOKEN_CONTRACT[network],
              startblock: lastBlock.minus(1).toString(),
              endblock: 99999999,
              sort: 'desc',
            },
          }),
        )
      ).result ?? []
    )
      .slice(0, lastBlock.eq(1) ? 1 : undefined) // Take only the latest transaction into account if the DB is empty
      .filter((item) => {
        if (new Prisma.Decimal(item.confirmations).lt(MIN_CONFIRMATIONS_EXPECTED)) {
          return false;
        }

        if (item.to?.toLowerCase() !== hotWalletAddress.toLowerCase()) {
          return false;
        }

        if (liquitidyProviders.includes(item.from?.toLowerCase())) {
          logger.debug(
            { item },
            'Will ignore item because the transfer comes from a liquidity provider',
          );
          return false;
        }

        return true;
      });

    const failed: typeof depositTxs = [];
    for (let i = 0; i < depositTxs.length; i++) {
      const item = depositTxs[i];

      try {
        const parsedItem: Omit<Deposit, 'createdAt' | 'updatedAt'> = {
          network: toDbNetwork(network),
          hash: item.hash,
          transactionIndex: +item.transactionIndex,
          blockNumber: new Prisma.Decimal(item.blockNumber),
          at: DateTime.fromMillis(+item.timeStamp * 1000, { zone: 'utc' }).toJSDate(),
          addressFrom: web3.utils.toChecksumAddress(item.from),
          addressTo: web3.utils.toChecksumAddress(item.to),
          addressContract: web3.utils.toChecksumAddress(item.contractAddress),
          tokenDecimals: +item.tokenDecimal,
          gas: new Prisma.Decimal(item.gas),
          gasPrice: new Prisma.Decimal(item.gasPrice).div(`1e${item.tokenDecimal}`),
          value: new Prisma.Decimal(item.value).div(`1e${item.tokenDecimal}`),
        };

        await prisma.deposit.upsert({
          where: { network_hash: { hash: parsedItem.hash, network: parsedItem.network } },
          create: parsedItem,
          update: parsedItem,
        });
      } catch (err) {
        logger.error({ err }, 'Failed to save transaction to DB');
        failed.push(item);
      }
    }

    res
      .status(failed.length === 0 ? StatusCodes.OK : StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ transactionCount: depositTxs.length, failed: failed.length });
  },
});
