import { useMemo } from 'react';
import Web3 from 'web3';
import ABI from 'human-standard-token-abi';
import { Big } from 'big.js';

import { useOnboard } from '../onboard';
import { SB_TOKEN_CONTRACT } from '../swingby-token';

export const useGetSwingbyBalance = () => {
  const { wallet, network, address } = useOnboard();
  return useMemo(
    () => ({
      getSwingbyBalance: async () => {
        if (!address || !wallet) {
          throw new Error('No wallet connected');
        }

        if (!network) {
          throw new Error('No valid network selected');
        }

        const web3 = new Web3(wallet.provider);
        const contract = new web3.eth.Contract(ABI, SB_TOKEN_CONTRACT[network]);

        const result = await contract.methods.balanceOf(address).call();
        return new Big(result).div(`1e${await contract.methods.decimals().call()}`).toFixed();
      },
    }),
    [address, wallet, network],
  );
};
