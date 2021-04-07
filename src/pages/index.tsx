import { logger } from '../modules/logger';
import { useOnboard } from '../modules/web3';

export default function HomePage() {
  const { onboard, network, address, wallet } = useOnboard();
  return (
    <>
      <div>Wallet: {JSON.stringify(wallet)}</div>
      <div>Address: {JSON.stringify(address)}</div>
      <div>Network: {JSON.stringify(network)}</div>
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
