import { StatusCodes } from 'http-status-codes';
import ABI from 'human-standard-token-abi';
import { TransactionConfig } from 'web3-eth';
import { Big } from 'big.js';
import { Prisma } from '@prisma/client';

import { createEndpoint, getStringParam } from '../../../../modules/server__api-endpoint';
import { server__ethereumWalletPrivateKey } from '../../../../modules/server__env';
import { buildWeb3Instance } from '../../../../modules/server__web3';
import { SB_TOKEN_CONTRACT } from '../../../../modules/swingby-token';
import { fetcher } from '../../../../modules/fetch';

export default createEndpoint({
  logId: 'swap-fee',
  fn: async ({ req, res, network }) => {
    const etherSymbol = network === 56 || network === 97 ? 'BNB' : 'ETH';
    const etherUsdtPrice = (
      await fetcher<{ data: { [k in 'ask' | 'bid']: [string, string] } }>(
        `https://ascendex.com/api/pro/v1/ticker?symbol=${etherSymbol}/USDT`,
      )
    ).data.bid[0];
    const swingbyUsdtPrice = (
      await fetcher<{ data: { [k in 'ask' | 'bid']: [string, string] } }>(
        `https://ascendex.com/api/pro/v1/ticker?symbol=SWINGBY/USDT`,
      )
    ).data.bid[0];

    const web3 = buildWeb3Instance({ network });
    const { address } = web3.eth.accounts.privateKeyToAccount(server__ethereumWalletPrivateKey);
    const contract = new web3.eth.Contract(ABI, SB_TOKEN_CONTRACT[network]);

    const addressReceiving =
      getStringParam({ req, from: 'query', name: 'addressReceiving', defaultValue: '' }) || address;
    const amount = new Big(
      getStringParam({ req, from: 'query', name: 'amount', defaultValue: '1' }),
    );

    const decimals = await contract.methods.decimals().call();
    const gasPrice = new Prisma.Decimal(await web3.eth.getGasPrice()).times('1.5').toFixed(0);
    const rawTx: TransactionConfig = {
      nonce: await web3.eth.getTransactionCount(address),
      gasPrice: web3.utils.toHex(gasPrice),
      from: address,
      to: SB_TOKEN_CONTRACT[network],
      value: '0x0',
      data: contract.methods
        .approve(addressReceiving, amount.times(`1e${decimals}`).toFixed())
        .encodeABI(),
    };

    const etherGasPrice = web3.utils.fromWei(gasPrice, 'ether');
    const estimatedGas = await web3.eth.estimateGas(rawTx);
    const estimatedFeeEther = new Big(etherGasPrice).times(estimatedGas);
    const estimatedFeeUsd = estimatedFeeEther.times(etherUsdtPrice);
    const estimatedFeeSwingby = estimatedFeeUsd.div(swingbyUsdtPrice);

    res.status(StatusCodes.OK).json({
      gasPrice: etherGasPrice,
      estimatedGas,
      estimatedFeeEther: estimatedFeeEther.toFixed(),
      estimatedFeeUsd: estimatedFeeUsd.toFixed(),
      estimatedFeeSwingby: estimatedFeeSwingby.toFixed(),
    });
  },
});
