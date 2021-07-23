import { StatusCodes } from 'http-status-codes';

import { createEndpoint } from '../../../../modules/server__api-endpoint';
import { assertPaymentSanityCheck } from '../../../../modules/server__payment-sanity-check';

export default createEndpoint({
  logId: 'status',
  fn: async ({ res, network, logger }) => {
    try {
      await assertPaymentSanityCheck({ network });
      res.status(StatusCodes.OK).json({ checkPassed: true });
    } catch (err) {
      logger.error({ err }, 'Sanity chech failed');
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        checkPassed: false,
        message: err.message,
      });
    }
  },
});
