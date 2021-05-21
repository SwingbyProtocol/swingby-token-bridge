import { Button } from '@swingby-protocol/pulsar';
import { FormattedMessage } from 'react-intl';

import { ShortAddress } from '../../../components/ShortAddress';
import { logger } from '../../../modules/logger';
import { isValidNetworkId, useOnboard } from '../../../modules/onboard';
import { SB_TOKEN_CONTRACT } from '../../../modules/swingby-token';

import { Container, StyledNetworkTag, StyledAddTokenButton, WalletWrapper } from './styled';

export const ConnectWallet = ({ className }: { className?: string }) => {
  const { address, network, onboard, wallet } = useOnboard();

  return (
    <Container className={className}>
      {!!address && !!wallet?.provider?._metamask && (
        <StyledAddTokenButton
          variant="tertiary"
          size="street"
          shape="fit"
          onClick={() => {
            if (
              !isValidNetworkId(network) ||
              !wallet ||
              !wallet.provider ||
              !wallet.provider.request
            ) {
              return;
            }

            wallet.provider.request({
              method: 'wallet_watchAsset',
              params: {
                type: 'ERC20',
                options: {
                  address: SB_TOKEN_CONTRACT[network],
                  symbol: 'SWINGBY',
                  decimals: 18,
                  image:
                    'https://github.com/trustwallet/assets/raw/master/blockchains/binance/assets/SWINGBY-888/logo.png',
                },
              },
            });
          }}
        >
          <FormattedMessage id="wallet.add-token-to-wallet" />
        </StyledAddTokenButton>
      )}
      <WalletWrapper>
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
      </WalletWrapper>
    </Container>
  );
};
