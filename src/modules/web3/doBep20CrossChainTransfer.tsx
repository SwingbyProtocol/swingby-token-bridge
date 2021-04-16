import Web3 from 'web3';
import { Big, BigSource } from 'big.js';
import { TransactionConfig } from 'web3-eth';
import { API } from 'bnc-onboard/dist/src/interfaces'; // eslint-disable-line import/no-internal-modules
import { DateTime } from 'luxon';
import { decodeAddress, isAddressValid } from 'binance-chain-sdk-lite';
import ABI from 'human-standard-token-abi';
import { createOrUpdateToast } from '@swingby-protocol/pulsar';

import { SB_TOKEN_CONTRACT } from '../swingby-token';
import { logger } from '../logger';

import { getOnboardData } from './getOnboardData';
import { BEP20_CROSS_CHAIN_ABI, BEP20_CROSS_CHAIN_CONTRACT } from './BEP20_CROSS_CHAIN_CONTRACT';
import { watchTransaction } from './watchTransaction';

const TOAST_ID = 'run-bep20-cross-chain';

export const doBep20CrossChainTransfer = async ({
  amount: amountParam,
  addressReceiving,
  onboard: onboardParam,
}: {
  amount: BigSource;
  addressReceiving: string;
  onboard: API | null;
}) => {
  try {
    const { wallet, address, network } = getOnboardData({ onboard: onboardParam });
    if (network !== 56 && network !== 97) {
      throw new Error(`Invalid network for BEP20->BEP2 transfers: ${network}`);
    }

    if (
      !isAddressValid({
        address: addressReceiving,
        context: { mode: network === 97 ? 'test' : 'production' },
      })
    ) {
      throw new Error(`Address "${address}" is valid to swap from network: ${network}`);
    }

    const amount = new Big(amountParam);
    const web3 = new Web3(wallet.provider);
    const decimals = await (async () => {
      const contract = new web3.eth.Contract(ABI, SB_TOKEN_CONTRACT[network]);
      return await contract.methods.decimals().call();
    })();
    const contract = new web3.eth.Contract(
      BEP20_CROSS_CHAIN_ABI,
      BEP20_CROSS_CHAIN_CONTRACT[network],
    );

    const relayFee = await contract.methods.relayFee().call();
    logger.debug({ relayFee }, 'Got relay fee value');

    const gasPrice = await web3.eth.getGasPrice();
    const rawTx: TransactionConfig = {
      nonce: await web3.eth.getTransactionCount(address),
      gasPrice: web3.utils.toHex(gasPrice),
      from: address,
      to: BEP20_CROSS_CHAIN_CONTRACT[network],
      value: web3.utils.toHex(relayFee),
      data: contract.methods
        .transferOut(
          SB_TOKEN_CONTRACT[network],
          `0x${decodeAddress({ address: addressReceiving }).toString('hex')}`,
          web3.utils.toHex(amount.times(`1e${decimals}`).toFixed()),
          web3.utils.toHex(Math.round(DateTime.local().plus({ days: 1 }).toMillis() / 1000)),
        )
        .encodeABI(),
    };

    const estimatedGas = await web3.eth.estimateGas(rawTx);
    if (!estimatedGas) {
      logger.warn(rawTx, 'Did not get any value from estimateGas(): %s', estimatedGas);
    } else {
      logger.debug(
        rawTx,
        'Estimated gas that will be spent %s (price: %s ETH)',
        estimatedGas,
        web3.utils.fromWei(gasPrice, 'ether'),
      );
    }

    return watchTransaction({
      network,
      tx: web3.eth.sendTransaction({ ...rawTx, gas: estimatedGas }),
      toastId: TOAST_ID,
    });
  } catch (err) {
    logger.error({ err }, 'Failed to run BEP20 cross-chain transfer');
    createOrUpdateToast({
      content: 'BEP20 cross-chain transaction failed' + (err.message ? `: ${err.message}` : ''),
      type: 'danger',
      toastId: TOAST_ID,
    });
    throw err;
  }
};
