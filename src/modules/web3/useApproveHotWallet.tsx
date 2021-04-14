import { useMemo } from 'react';
import Web3 from 'web3';
import ABI from 'human-standard-token-abi';
import { Big, BigSource } from 'big.js';
import { TransactionConfig } from 'web3-eth';

import { useOnboard } from '../onboard';
import { SB_TOKEN_CONTRACT } from '../swingby-token';
import { logger } from '../logger';
import { fetcher } from '../fetch';

export const useApproveHotWallet = () => {
  const { wallet, network, address } = useOnboard();
  return useMemo(
    () => ({
      approveHotWallet: async ({ amount: amountParam }: { amount: BigSource }) => {
        if (!address || !wallet) {
          throw new Error('No wallet connected');
        }

        if (!network) {
          throw new Error('No valid network selected');
        }

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

        const result = await contract.methods.balanceOf(address).call();
        return new Big(result).div(`1e${await contract.methods.decimals().call()}`).toFixed();
      },
    }),
    [address, wallet, network],
  );
};
