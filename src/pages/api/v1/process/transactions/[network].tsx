import { createEndpoint, getStringParam } from '../../../../../modules/server__api-endpoint';
import { isValidNetworkId, NETWORK_IDS } from '../../../../../modules/web3';

export default createEndpoint({
  isSecret: true,
  fn: async ({ req, res }) => {
    const networkId = +getStringParam({
      req,
      from: 'query',
      name: 'network',
      oneOf: NETWORK_IDS.map((it) => `${it}` as const),
    });
    if (!isValidNetworkId(networkId)) {
      throw new Error(`Invalid network ID: ${networkId}`);
    }
  },
});
