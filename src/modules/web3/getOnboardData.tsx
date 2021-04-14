import { API } from 'bnc-onboard/dist/src/interfaces'; // eslint-disable-line import/no-internal-modules

import { isValidNetworkId } from '../onboard';

export const getOnboardData = ({ onboard }: { onboard: API | null }) => {
  if (!onboard) {
    throw new Error('Onboard was not initialised');
  }

  const wallet = onboard.getState().wallet;
  const address = onboard.getState().address;
  const network = onboard.getState().network;

  if (!wallet || !wallet.provider || !address) {
    throw new Error('Onboard was not properly initialised');
  }

  if (!isValidNetworkId(network)) {
    throw new Error(`Invalid network selected: ${network}`);
  }

  return { onboard, wallet, address, network };
};
