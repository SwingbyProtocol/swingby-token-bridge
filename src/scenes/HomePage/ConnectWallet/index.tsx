import { Button } from '@swingby-protocol/pulsar';
import { FormattedMessage } from 'react-intl';

import { ShortAddress } from '../../../components/ShortAddress';
import { logger } from '../../../modules/logger';
import { useOnboard } from '../../../modules/onboard';

import { Container, StyledNetworkTag } from './styled';

export const ConnectWallet = ({ className }: { className?: string }) => {
  const { address, network, onboard } = useOnboard();
  return (
    <Container className={className}>
      {!!address && <StyledNetworkTag network={network} />}
      <Button
        variant="secondary"
        size="street"
        shape="fit"
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
        {address ? <ShortAddress value={address} /> : <FormattedMessage id="wallet.connect" />}
      </Button>
    </Container>
  );
};
