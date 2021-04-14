import { StatusCodes } from 'http-status-codes';

import { createEndpoint } from '../../../../../modules/server__api-endpoint';

export default createEndpoint({
  isSecret: true,
  fn: async ({ req, res }) => {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    // const networkId = +getStringParam({
    //   req,
    //   from: 'query',
    //   name: 'network',
    //   oneOf: NETWORK_IDS.map((it) => `${it}` as const),
    // });
    // if (!isValidNetworkId(networkId)) {
    //   throw new Error(`Invalid network ID: ${networkId}`);
    // }
  },
});
