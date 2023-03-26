import { StatusCodes } from 'http-status-codes';
import { Prisma, PaymentStatus } from '@prisma/client';
import { DateTime } from 'luxon';
import ABI from 'human-standard-token-abi';

import { createEndpoint } from '../../../../../modules/server__api-endpoint';
import { buildWeb3Instance } from '../../../../../modules/server__web3';
import { toDbNetwork } from '../../../../../modules/server__db';
import { MIN_CONFIRMATIONS_EXPECTED } from '../../../../../modules/web3';

export default createEndpoint({
  isSecret: false,
  logId: 'process/failed-payments',
  fn: async ({ req, res, network, prisma, logger }) => {
    const web3 = buildWeb3Instance({ network });

    const pendingTransactions = await prisma.payment.findMany({
      where: {
        network: { equals: toDbNetwork(network) },
        status: { equals: PaymentStatus.PENDING },
      },
      orderBy: { blockNumber: 'asc' },
    });
    logger.trace('Got %d pending transactions to check', pendingTransactions.length);

    const failed: typeof pendingTransactions = [];
    for (let i = 0; i < pendingTransactions.length; i++) {
      logger.trace('Will check transaction: %j', pendingTransactions[i].hash);

      try {
        const receipt = await web3.eth.getTransactionReceipt(pendingTransactions[i].hash);
        const confirmations = (await web3.eth.getBlockNumber()) - receipt.blockNumber;
        if (confirmations < MIN_CONFIRMATIONS_EXPECTED) {
          continue;
        }

        const transaction = await web3.eth.getTransactionFromBlock(
          receipt.blockNumber,
          receipt.transactionIndex,
        );
        const txInput = web3.eth.abi.decodeParameters(
          ABI.find((it) => it.name === 'transfer')!.inputs as any,
          transaction.input.substring(10),
        );
        const addressReceiving = txInput[0];
        const amount = txInput[1];

        const tokenDecimals = 18;
        const at = DateTime.fromMillis(
          +(await web3.eth.getBlock(receipt.blockNumber)).timestamp * 1000,
          { zone: 'utc' },
        ).toJSDate();

        logger.trace(
          { receipt, transaction },
          'Will update transaction %j in DB',
          pendingTransactions[i].hash,
        );
        await prisma.payment.update({
          where: { network_hash: { hash: receipt.transactionHash, network: toDbNetwork(network) } },
          data: {
            network: toDbNetwork(network),
            hash: receipt.transactionHash,
            status: receipt.status ? PaymentStatus.COMPLETED : PaymentStatus.FAILED,
            transactionIndex: +receipt.transactionIndex,
            blockNumber: new Prisma.Decimal(receipt.blockNumber),
            at,
            addressFrom: web3.utils.toChecksumAddress(receipt.from),
            addressTo: web3.utils.toChecksumAddress(addressReceiving),
            addressContract: web3.utils.toChecksumAddress(receipt.to),
            tokenDecimals,
            gas: new Prisma.Decimal(transaction.gas),
            gasPrice: new Prisma.Decimal(transaction.gasPrice).div(`1e${tokenDecimals}`),
            value: new Prisma.Decimal(amount).div(`1e${tokenDecimals}`),
          },
        });
      } catch (err) {
        logger.error({ err }, 'Failed to save transaction to DB');
        failed.push(pendingTransactions[i]);
      }
    }

    res
      .status(failed.length === 0 ? StatusCodes.OK : StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ transactionCount: pendingTransactions.length, failed: failed.length });
  },
});
