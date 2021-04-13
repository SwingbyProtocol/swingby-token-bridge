import { FormattedMessage } from 'react-intl';

import { ShortAddress } from '../components/ShortAddress';
import { logger } from '../modules/logger';
import { isValidNetworkId, useOnboard } from '../modules/web3';

const Test = () => {
  const { address, network, onboard } = useOnboard();

  return (
    <>
      <div>
        Address: <ShortAddress value={address} />
      </div>
      <div>
        Network:{' '}
        {isValidNetworkId(network) ? <FormattedMessage id={`network.short.${network}`} /> : 'null'}
      </div>
    </>
  );
};

export default function HomePage() {
  const { address, network, onboard } = useOnboard();
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
            if (address) {
              onboard?.walletReset();
              return;
            }

            onboard?.walletSelect();
          } catch (e) {
            logger.error(e);
          }
        }}
      >
        {address ? 'Disconnect' : 'Connect'}
      </button>
      <Test />
    </>
  );
}
