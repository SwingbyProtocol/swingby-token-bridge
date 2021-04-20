import { StatusCodes } from 'http-status-codes';
import { stringifyUrl } from 'query-string';
import { Prisma, Transaction } from '@prisma/client';
import { DateTime } from 'luxon';

import { server__ethereumWalletPrivateKey } from '../../../../../modules/env';
import { fetcher } from '../../../../../modules/fetch';
import { createEndpoint } from '../../../../../modules/server__api-endpoint';
import { buildWeb3Instance, getScanApiUrl } from '../../../../../modules/server__web3';
import { SB_TOKEN_CONTRACT } from '../../../../../modules/swingby-token';
import { logger } from '../../../../../modules/logger';
import { toDbNetwork } from '../../../../../modules/server__db';

type ApiResult = {
  result: Array<{
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
  }>;
};

export default createEndpoint({
  isSecret: true,
  fn: async ({ req, res, network, prisma }) => {
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
        await prisma.transaction.findFirst({
          where: {
            network: { equals: toDbNetwork(network) },
            addressTo: { equals: hotWalletAddress, mode: 'insensitive' },
          },
          orderBy: { blockNumber: 'desc' },
        })
      )?.blockNumber ?? new Prisma.Decimal(1);
    logger.debug('Will start looking from block %s', lastBlock);

    const depositTxs = (
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
    ).result.filter((item) => {
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
        const parsedItem: Omit<
          Transaction,
          'transactionOutHash' | 'transactionOutIndex' | 'transactionOutNetwork'
        > = {
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

        await prisma.transaction.upsert({
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
