import { Prisma } from '@prisma/client';
import { stringifyUrl } from 'query-string';

import { prisma, server__ethereumWalletPrivateKey } from '../server__env';
import { NetworkId } from '../onboard';
import { toDbNetwork } from '../server__db';
import { buildWeb3Instance, getScanApiUrl } from '../server__web3';
import { fetcher } from '../fetch';
import { SB_TOKEN_CONTRACT } from '../swingby-token';
import { logger } from '../logger';

type ApiResult = {
  result?: Array<{
    blockNumber: string;
    hash: string;
    from: string;
  }> | null;
};

export const assertPaymentSanityCheck = async ({
  network,
}: {
  network: NetworkId;
}): Promise<void> => {
  const web3 = buildWeb3Instance({ network });
  const hotWallet = web3.eth.accounts.privateKeyToAccount(server__ethereumWalletPrivateKey);

  const isDbEmpty =
    (await prisma.payment.count({
      where: {
        network: { equals: toDbNetwork(network) },
        addressFrom: { equals: hotWallet.address, mode: 'insensitive' },
      },
    })) <= 0;
  logger.debug({ isDbEmpty }, 'Check if DB is empty');

  if (isDbEmpty) {
    logger.info('There are no payments in the DB. Sanity check passed.');
    return;
  }

  const lastBlockNumberInDb =
    (
      await prisma.payment.findFirst({
        where: {
          network: { equals: toDbNetwork(network) },
          addressFrom: { equals: hotWallet.address, mode: 'insensitive' },
          blockNumber: { not: null },
        },
        orderBy: { blockNumber: 'desc' },
      })
    )?.blockNumber ?? null;
  logger.debug({ lastBlockNumberInDb }, 'Got last block number in DB');

  const latestPayments = (
    (
      await fetcher<ApiResult>(
        stringifyUrl({
          url: getScanApiUrl({ network }),
          query: {
            module: 'account',
            action: 'tokentx',
            address: hotWallet.address,
            contractaddress: SB_TOKEN_CONTRACT[network],
            startblock: new Prisma.Decimal(lastBlockNumberInDb ?? 1).minus(1).toString(),
            endblock: 99999999,
            sort: 'desc',
          },
        }),
      )
    ).result ?? []
  ).filter((it) => it.from.toLowerCase() === hotWallet.address.toLowerCase());
  if (latestPayments.length <= 0) {
    logger.info('There are no payments in Etherscan/BSCscan. Sanity check passed.');
    return;
  }

  const lastPayment = await prisma.payment.findUnique({
    where: { network_hash: { network: toDbNetwork(network), hash: latestPayments[0].hash } },
  });

  if (!lastPayment) {
    throw new Error(
      `The last payment in the chain ("${latestPayments[0].hash}") was not found in DB`,
    );
  }

  logger.info('Last payment from Etherscan/BSCscan found in the DB. Sanity check passed.');
};
