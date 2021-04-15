import Web3 from 'web3';
import { Big } from 'big.js';
import { API } from 'bnc-onboard/dist/src/interfaces'; // eslint-disable-line import/no-internal-modules

import { logger } from '../logger';
import { fetcher } from '../fetch';

import { getOnboardData } from './getOnboardData';
import { BEP20_CROSS_CHAIN_CONTRACT, BEP20_CROSS_CHAIN_ABI } from './BEP20_CROSS_CHAIN_CONTRACT';

export const getBep20CrossChainAllowance = async ({
  onboard: onboardParam,
}: {
  onboard: API | null;
}) => {
  const { wallet, address, network } = getOnboardData({ onboard: onboardParam });
  if (network !== 56 && network !== 97) {
    throw new Error(`Invalid network for BEP20->BEP2 transfers: ${network}`);
  }

  const { address: addressDeposit } = await fetcher<{ address: string }>('/api/v1/address');
  const web3 = new Web3(wallet.provider);
  const contract = new web3.eth.Contract(
    BEP20_CROSS_CHAIN_ABI,
    BEP20_CROSS_CHAIN_CONTRACT[network],
  );
  const allowance = await contract.methods.allowance(address, addressDeposit).call();
  logger.debug('Allowance call returned: %s', allowance);

  const decimals = await contract.methods.decimals().call();
  logger.debug('Decimals call returned: %s', decimals);

  return new Big(allowance).div(`1e${decimals}`).toFixed();
};
