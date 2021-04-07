import { FormattedMessage } from 'react-intl';

import { ShortAddress } from '../components/ShortAddress';
import { logger } from '../modules/logger';
import { useOnboard, isValidNetworkId } from '../modules/web3';

export default function HomePage() {
  const { onboard, network, address, wallet } = useOnboard();
  return (
    <>
      <div>
        Address: <ShortAddress value={address} />
      </div>
      <div>
        Network:{' '}
        {isValidNetworkId(network) ? <FormattedMessage id={`network.short.${network}`} /> : 'null'}
      </div>
      <button
        onClick={() => {
          try {
            if (wallet) {
              onboard?.walletReset();
              return;
            }

            onboard?.walletSelect();
          } catch (e) {
            logger.error(e);
          }
        }}
      >
        {wallet ? 'Disconnect' : 'Connect'}
      </button>
    </>
  );
}
