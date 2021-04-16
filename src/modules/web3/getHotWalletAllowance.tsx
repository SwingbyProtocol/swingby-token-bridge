import Web3 from 'web3';
import ABI from 'human-standard-token-abi';
import { Big } from 'big.js';
import { API } from 'bnc-onboard/dist/src/interfaces'; // eslint-disable-line import/no-internal-modules

import { SB_TOKEN_CONTRACT } from '../swingby-token';
import { logger } from '../logger';
import { fetcher } from '../fetch';

import { getOnboardData } from './getOnboardData';

export const getHotWalletAllowance = async ({ onboard: onboardParam }: { onboard: API | null }) => {
  const { wallet, address, network } = getOnboardData({ onboard: onboardParam });

  const { address: addressDeposit } = await fetcher<{ address: string }>('/api/v1/address');
  const web3 = new Web3(wallet.provider);
  const contract = new web3.eth.Contract(ABI, SB_TOKEN_CONTRACT[network]);
  const allowance = await contract.methods.allowance(address, addressDeposit).call();

  const decimals = await contract.methods.decimals().call();
  const result = new Big(allowance).div(`1e${decimals}`).toFixed();
  logger.debug('Hot wallet allowance call returned: %s', result);
  return result;
};
