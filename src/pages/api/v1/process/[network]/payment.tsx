import { StatusCodes } from 'http-status-codes';
import ABI from 'human-standard-token-abi';
import { TransactionConfig } from 'web3-eth';
import { Prisma } from '@prisma/client';
import { DateTime } from 'luxon';

import { server__ethereumWalletPrivateKey } from '../../../../../modules/env';
import { createEndpoint } from '../../../../../modules/server__api-endpoint';
import { buildWeb3Instance } from '../../../../../modules/server__web3';
import { SB_TOKEN_CONTRACT } from '../../../../../modules/swingby-token';
import { logger } from '../../../../../modules/logger';
import { toDbNetwork } from '../../../../../modules/server__db';
import { getDestinationNetwork } from '../../../../../modules/web3';
import { fetcher } from '../../../../../modules/fetch';

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

    const pendingTransactions = await prisma.transaction.findMany({
      where: {
        network: { equals: toDbNetwork(depositNetwork) },
        addressTo: { equals: hotWallet.address, mode: 'insensitive' },
        transactionIn: { is: null },
        transactionOut: { is: null },
      },
      orderBy: { at: 'asc' },
    });
    logger.debug('Got %d pending transactions', pendingTransactions.length);

    const cappedPendingTransactions = pendingTransactions.slice(0, 2);
    const failed: typeof pendingTransactions = [];
    for (let i = 0; i < cappedPendingTransactions.length; i++) {
      const tx = cappedPendingTransactions[i];

      try {
        const gasPrice = await web3.eth.getGasPrice();
        const rawTx: TransactionConfig = {
          chainId: network,
          nonce: await web3.eth.getTransactionCount(hotWallet.address),
          gasPrice: web3.utils.toHex(gasPrice),
          from: hotWallet.address,
          to: SB_TOKEN_CONTRACT[network],
          value: '0x0',
          data: contract.methods
            .transfer(tx.addressFrom, web3.utils.toHex(tx.value.times(`1e${decimals}`).toFixed(0)))
            .encodeABI(),
        };

        const estimatedGas = await web3.eth.estimateGas(rawTx);
        const etherGasPrice = new Prisma.Decimal(web3.utils.fromWei(gasPrice, 'ether'));
        const estimatedFeeEther = etherGasPrice.times(estimatedGas);
        const estimatedFeeSwingby = estimatedFeeEther.times(etherUsdtPrice).div(swingbyUsdtPrice);
        logger.info({ estimatedFeeEther, estimatedFeeSwingby }, 'Estimated transaction');

        const amountReceiving = tx.value.minus(estimatedFeeSwingby);
        logger.info({ value: amountReceiving }, 'Calculated outgoing transaction value');

        const signedTransaction = await web3.eth.accounts.signTransaction(
          {
            ...rawTx,
            gas: new Prisma.Decimal(estimatedGas).times('1.5').toFixed(0),
            data: contract.methods
              .transfer(
                tx.addressFrom,
                web3.utils.toHex(amountReceiving.times(`1e${decimals}`).toFixed(0)),
              )
              .encodeABI(),
          },
          hotWallet.privateKey,
        );

        if (!signedTransaction.rawTransaction) {
          logger.error({ signedTransaction }, 'Error signing transaction');
          throw new Error('Error signing transaction!');
        }

        const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
        await prisma.transaction.create({
          data: {
            transactionIn: {
              connect: {
                network_hash_transactionIndex: {
                  hash: tx.hash,
                  network: tx.network,
                  transactionIndex: tx.transactionIndex,
                },
              },
            },

            network: toDbNetwork(network),
            hash: result.transactionHash,
            transactionIndex: result.transactionIndex,
            blockNumber: result.blockNumber,
            addressFrom: web3.utils.toChecksumAddress(result.from),
            addressTo: web3.utils.toChecksumAddress(result.to),
            addressContract: web3.utils.toChecksumAddress(
              result.contractAddress ?? SB_TOKEN_CONTRACT[network],
            ),
            at: DateTime.utc().toJSDate(),
            tokenDecimals: +decimals,
            value: amountReceiving,
            gasPrice: etherGasPrice,
            gas: result.gasUsed,
          },
        });
      } catch (err) {
        logger.fatal({ err }, 'Crashed sending transaction');
        failed.push(tx);
      }
    }

    res.status(failed.length === 0 ? StatusCodes.OK : StatusCodes.INTERNAL_SERVER_ERROR).json({
      totalCount: pendingTransactions.length,
      processedCount: cappedPendingTransactions.length,
      failed: failed.length,
    });
  },
});
