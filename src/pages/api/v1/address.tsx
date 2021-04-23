import Web3 from 'web3';
import { StatusCodes } from 'http-status-codes';

import { createEndpoint } from '../../../modules/server__api-endpoint';
import { server__ethereumWalletPrivateKey } from '../../../modules/server__env';

export default createEndpoint<{ address: string }>({
  fn: ({ res }) => {
    const web3 = new Web3();
    const { address } = web3.eth.accounts.privateKeyToAccount(server__ethereumWalletPrivateKey);
    res.status(StatusCodes.OK).json({ address });
  },
});
