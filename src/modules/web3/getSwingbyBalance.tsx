import Web3 from 'web3';
import ABI from 'human-standard-token-abi';
import { Big } from 'big.js';
import { API } from 'bnc-onboard/dist/src/interfaces'; // eslint-disable-line import/no-internal-modules

import { isValidNetworkId } from '../onboard';
import { SB_TOKEN_CONTRACT } from '../swingby-token';

import { getOnboardData } from './getOnboardData';

export const getSwingbyBalance = async ({ onboard: onboardParam }: { onboard: API | null }) => {
  const { wallet, address } = getOnboardData({ onboard: onboardParam });

  const web3 = new Web3(wallet.provider);
  const networkId = await web3.eth.net.getId();
  if (!isValidNetworkId(networkId)) {
    throw new Error(`Invalid network ID: ${networkId}`);
  }

  const contract = new web3.eth.Contract(ABI, SB_TOKEN_CONTRACT[networkId]);
  const result = await contract.methods.balanceOf(address).call();
  return new Big(result).div(`1e${await contract.methods.decimals().call()}`).toFixed();
};
