import { StatusCodes } from 'http-status-codes';
import ABI from 'human-standard-token-abi';
import { TransactionConfig } from 'web3-eth';
import { PaymentStatus, Prisma } from '@prisma/client';

import { server__ethereumWalletPrivateKey } from '../../../../../modules/env';
import { createEndpoint } from '../../../../../modules/server__api-endpoint';
import { buildWeb3Instance } from '../../../../../modules/server__web3';
import { SB_TOKEN_CONTRACT } from '../../../../../modules/swingby-token';
import { logger } from '../../../../../modules/logger';
import { toDbNetwork } from '../../../../../modules/server__db';
import { getDestinationNetwork } from '../../../../../modules/web3';
import { fetcher } from '../../../../../modules/fetch';

const MAX_TRANSACTIONS_PER_CALL = 10;

export default createEndpoint({
  isSecret: true,
  fn: async ({ req, res, network: depositNetwork, prisma }) => {
    const network = getDestinationNetwork(depositNetwork);
    logger.info({ depositNetwork, network }, 'Getting started with these networks');

    const etherSymbol = network === 56 || network === 97 ? 'BNB' : 'ETH';
    const etherUsdtPrice = (
      await fetcher<{ data: { [k in 'ask' | 'bid']: [string, string] } }>(
        `https://bitmax.io/api/pro/v1/ticker?symbol=${etherSymbol}/USDT`,
      )
    ).data.bid[0];
    const swingbyUsdtPrice = (
      await fetcher<{ data: { [k in 'ask' | 'bid']: [string, string] } }>(
        `https://bitmax.io/api/pro/v1/ticker?symbol=SWINGBY/USDT`,
      )
    ).data.bid[0];

    const web3 = buildWeb3Instance({ network });
    const hotWallet = web3.eth.accounts.privateKeyToAccount(server__ethereumWalletPrivateKey);

    const contract = new web3.eth.Contract(ABI, SB_TOKEN_CONTRACT[network]);
    const decimals = await contract.methods.decimals().call();

    const pendingTransactions = await prisma.deposit.findMany({
      where: {
        network: { equals: toDbNetwork(depositNetwork) },
        addressTo: { equals: hotWallet.address, mode: 'insensitive' },
        payments: { none: { status: { in: [PaymentStatus.PENDING, PaymentStatus.COMPLETED] } } },
      },
      orderBy: { at: 'asc' },
    });
    logger.debug('Got %d pending transactions', pendingTransactions.length);

    const cappedPendingTransactions = pendingTransactions.slice(0, MAX_TRANSACTIONS_PER_CALL);
    const failed: typeof pendingTransactions = [];
    for (let i = 0; i < cappedPendingTransactions.length; i++) {
      const txIn = cappedPendingTransactions[i];

      try {
        const gasPrice = new Prisma.Decimal(await web3.eth.getGasPrice()).times('1.5').toFixed(0);
        const rawTx: TransactionConfig = {
          chainId: network,
          // Dirty trick adding `i` here to avoid having to wait for a tx receipt for each item.
          nonce: i + (await web3.eth.getTransactionCount(hotWallet.address)),
          gasPrice: web3.utils.toHex(gasPrice),
          from: hotWallet.address,
          to: SB_TOKEN_CONTRACT[network],
          value: '0x0',
          data: contract.methods
            .transfer(
              txIn.addressFrom,
              web3.utils.toHex(txIn.value.times(`1e${decimals}`).toFixed(0)),
            )
            .encodeABI(),
        };

        logger.trace({ txIn, rawTx }, 'Will estimate gas');
        const estimatedGas = await web3.eth.estimateGas(rawTx);
        const etherGasPrice = new Prisma.Decimal(web3.utils.fromWei(gasPrice, 'ether'));
        const estimatedFeeEther = etherGasPrice.times(estimatedGas);
        const estimatedFeeSwingby = estimatedFeeEther.times(etherUsdtPrice).div(swingbyUsdtPrice);
        logger.info({ estimatedFeeEther, estimatedFeeSwingby }, 'Estimated transaction');

        const amountReceiving = txIn.value.minus(estimatedFeeSwingby);
        logger.info({ value: amountReceiving }, 'Calculated outgoing transaction value');

        const signedTransaction = await web3.eth.accounts.signTransaction(
          {
            ...rawTx,
            gas: new Prisma.Decimal(estimatedGas).times('1.5').toFixed(0),
            data: contract.methods
              .transfer(
                txIn.addressFrom,
                web3.utils.toHex(amountReceiving.times(`1e${decimals}`).toFixed(0)),
              )
              .encodeABI(),
          },
          hotWallet.privateKey,
        );

        const { rawTransaction } = signedTransaction;
        if (!rawTransaction) {
          logger.error({ signedTransaction }, 'Error signing transaction');
          throw new Error('Error signing transaction!');
        }

        await new Promise<string>((resolve, reject) => {
          web3.eth
            .sendSignedTransaction(rawTransaction)
            .on('error', reject)
            .on('transactionHash', async (hash) => {
              logger.trace('Got transaction hash %j', hash);

              await prisma.payment.create({
                data: {
                  deposit: {
                    connect: { network_hash: { hash: txIn.hash, network: txIn.network } },
                  },
                  network: toDbNetwork(network),
                  hash,
                },
              });

              resolve(hash);
            });
        });
      } catch (err) {
        logger.fatal({ err }, 'Crashed sending transaction');
        failed.push(txIn);
      }
    }

    res.status(failed.length === 0 ? StatusCodes.OK : StatusCodes.INTERNAL_SERVER_ERROR).json({
      totalCount: pendingTransactions.length,
      processedCount: cappedPendingTransactions.length,
      failed: failed.length,
    });
  },
});
