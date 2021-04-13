import { ShortAddress } from '../components/ShortAddress';
import { logger } from '../modules/logger';
import { useWallet } from '../modules/wallet';

export default function HomePage() {
  const { walletSelect, walletReset, address } = useWallet();
  return (
    <>
      <div>
        Address: <ShortAddress value={address} />
      </div>
      {/* <div>
        Network:{' '}
        {isValidNetworkId(network) ? <FormattedMessage id={`network.short.${network}`} /> : 'null'}
      </div> */}
      <button
        onClick={() => {
          try {
            if (address) {
              walletReset();
              return;
            }

            walletSelect();
          } catch (e) {
            logger.error(e);
          }
        }}
      >
        {address ? 'Disconnect' : 'Connect'}
      </button>
    </>
  );
}
