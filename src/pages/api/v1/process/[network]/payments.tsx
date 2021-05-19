import { StatusCodes } from 'http-status-codes';
import ABI from 'human-standard-token-abi';
import { TransactionConfig } from 'web3-eth';
import { LockId, PaymentStatus, Prisma } from '@prisma/client';

import {
  server__disableSubtractingNetworkFeeAsSwingby,
  server__ethereumWalletPrivateKey,
} from '../../../../../modules/server__env';
import { createEndpoint } from '../../../../../modules/server__api-endpoint';
import { buildWeb3Instance } from '../../../../../modules/server__web3';
import { SB_TOKEN_CONTRACT } from '../../../../../modules/swingby-token';
import { logger as baseLogger } from '../../../../../modules/logger';
import { toDbNetwork } from '../../../../../modules/server__db';
import { getDestinationNetwork } from '../../../../../modules/web3';
import { fetcher } from '../../../../../modules/fetch';
import { assertPaymentSanityCheck } from '../../../../../modules/server__payment-sanity-check';

const MAX_TRANSACTIONS_PER_CALL = 1; // No need to do more, since we call this endpoint tons of times.

export default createEndpoint({
  isSecret: true,
  fn: async ({ res, network: depositNetwork, prisma, lock, assertLockIsValid }) => {
    const network = getDestinationNetwork(depositNetwork);
    await lock(
      (() => {
        switch (network) {
          case 1:
            return LockId.PAYMENTS_SCRIPT_ETHEREUM;
          case 5:
            return LockId.PAYMENTS_SCRIPT_GOERLI;
          case 56:
            return LockId.PAYMENTS_SCRIPT_BSC;
          case 97:
            return LockId.PAYMENTS_SCRIPT_BSCT;
        }
      })(),
    );

    const logger = baseLogger.child({ depositNetwork, network });

    logger.info('Getting started with these networks');
    await assertPaymentSanityCheck({ network });

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

      const loopLogger = logger.child({ txIn });
      loopLogger.debug('Will get started with transaction %j', txIn.hash);

      try {
        const gasPrice = new Prisma.Decimal(await web3.eth.getGasPrice()).times('1.5').toFixed(0);
        const rawTx: TransactionConfig = {
          chainId: network,
          nonce: await web3.eth.getTransactionCount(hotWallet.address),
          gasPrice: web3.utils.toHex(gasPrice),
          from: hotWallet.address,
          to: SB_TOKEN_CONTRACT[network],
          value: '0x0',
          data: contract.methods
            .transfer(
              txIn.addressFrom,
              // We use `1` here to make sure that we can estimate gas even if there is not enough Swingby tokens in the wallet for the swap.
              web3.utils.toHex(1),
            )
            .encodeABI(),
        };

        loopLogger.trace({ rawTx }, 'Will estimate gas');
        const estimatedGas = await web3.eth.estimateGas(rawTx);
        const etherGasPrice = new Prisma.Decimal(web3.utils.fromWei(gasPrice, 'ether'));
        const estimatedFeeEther = etherGasPrice.times(estimatedGas);
        const estimatedFeeSwingby = estimatedFeeEther.times(etherUsdtPrice).div(swingbyUsdtPrice);
        loopLogger.info({ estimatedFeeEther, estimatedFeeSwingby }, 'Estimated transaction');

        const amountReceiving = txIn.value.minus(
          server__disableSubtractingNetworkFeeAsSwingby ? 0 : estimatedFeeSwingby,
        );
        loopLogger.info({ value: amountReceiving }, 'Calculated outgoing transaction value');

        const balance = new Prisma.Decimal(
          await contract.methods.balanceOf(hotWallet.address).call(),
        ).div(`1e${decimals}`);
        if (balance.lt(amountReceiving)) {
          loopLogger.fatal(
            { amountReceiving, balance },
            'The hot wallet does not contain enough Swingby Tokens',
          );
          throw new Error('The hot wallet does not contain enough Swingby Tokens');
        }

        if (!amountReceiving.gt(0)) {
          loopLogger.fatal({ amountReceiving }, '`amountReceiving` is not >0');
          throw new Error('`amountReceiving` is not >0');
        }

        loopLogger.debug(
          { amountReceiving, balance },
          'The hot wallet contains enoughs Swingby Tokens. Will sign and send transaction.',
        );

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

        const { rawTransaction, transactionHash } = signedTransaction;
        if (!rawTransaction || !transactionHash) {
          loopLogger.error({ signedTransaction }, 'Error signing transaction');
          throw new Error('Error signing transaction!');
        }

        await assertLockIsValid();
        await prisma.payment.create({
          data: {
            deposit: {
              connect: { network_hash: { hash: txIn.hash, network: txIn.network } },
            },
            network: toDbNetwork(network),
            hash: transactionHash,
            signedTransaction: rawTransaction,
          },
        });

        await new Promise<string>((resolve, reject) => {
          web3.eth
            .sendSignedTransaction(rawTransaction)
            .on('error', reject)
            .on('receipt', (receipt) => {
              loopLogger.trace('Got transaction receipt: %j', receipt);
              if (receipt.status) {
                resolve(receipt.transactionHash);
              } else {
                reject(receipt.transactionHash);
              }
            });
        });
      } catch (err) {
        loopLogger.fatal({ err }, 'Crashed sending transaction');
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
