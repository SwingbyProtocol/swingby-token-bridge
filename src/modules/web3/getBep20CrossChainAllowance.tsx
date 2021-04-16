import Web3 from 'web3';
import { Big } from 'big.js';
import { API } from 'bnc-onboard/dist/src/interfaces'; // eslint-disable-line import/no-internal-modules
import ABI from 'human-standard-token-abi';

import { logger } from '../logger';
import { SB_TOKEN_CONTRACT } from '../swingby-token';

import { getOnboardData } from './getOnboardData';
import { BEP20_CROSS_CHAIN_CONTRACT } from './BEP20_CROSS_CHAIN_CONTRACT';

export const getBep20CrossChainAllowance = async ({
  onboard: onboardParam,
}: {
  onboard: API | null;
}) => {
  const { wallet, address, network } = getOnboardData({ onboard: onboardParam });
  if (network !== 56 && network !== 97) {
    throw new Error(`Invalid network for BEP20->BEP2 transfers: ${network}`);
  }

  const web3 = new Web3(wallet.provider);
  const contract = new web3.eth.Contract(ABI, SB_TOKEN_CONTRACT[network]);
  const allowance = await contract.methods
    .allowance(address, BEP20_CROSS_CHAIN_CONTRACT[network])
    .call();

  const decimals = await contract.methods.decimals().call();
  const result = new Big(allowance).div(`1e${decimals}`).toFixed();
  logger.debug('BEP20 cross-chain allowance call returned: %s', result);
  return result;
};
