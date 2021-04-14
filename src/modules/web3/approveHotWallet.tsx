import Web3 from 'web3';
import ABI from 'human-standard-token-abi';
import { Big, BigSource } from 'big.js';
import { TransactionConfig } from 'web3-eth';
import { API } from 'bnc-onboard/dist/src/interfaces'; // eslint-disable-line import/no-internal-modules

import { SB_TOKEN_CONTRACT } from '../swingby-token';
import { logger } from '../logger';
import { fetcher } from '../fetch';

import { getOnboardData } from './getOnboardData';

export const approveHotWallet = async ({
  amount: amountParam,
  onboard: onboardParam,
}: {
  amount: BigSource;
  onboard: API | null;
}) => {
  const { wallet, address, network } = getOnboardData({ onboard: onboardParam });

  const { address: addressDeposit } = await fetcher<{ address: string }>('/api/v1/address');
  const amount = new Big(amountParam);
  const web3 = new Web3(wallet.provider);
  const contract = new web3.eth.Contract(ABI, SB_TOKEN_CONTRACT[network]);

  const decimals = await contract.methods.decimals().call();
  const gasPrice = await web3.eth.getGasPrice();
  const rawTx: TransactionConfig = {
    nonce: await web3.eth.getTransactionCount(address),
    gasPrice: web3.utils.toHex(gasPrice),
    from: address,
    to: SB_TOKEN_CONTRACT[network],
    value: '0x0',
    data: contract.methods
      .approve(addressDeposit, amount.times(`1e${decimals}`).toFixed())
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

  return web3.eth.sendTransaction({ ...rawTx, gas: estimatedGas });
};
