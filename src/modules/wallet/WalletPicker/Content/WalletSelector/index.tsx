import { Icon } from '@swingby-protocol/pulsar';
import { FormattedMessage } from 'react-intl';

import { OptionItem } from '../OptionItem';
import { WalletType } from '../WalletType';

import { OptionsContainer, Subtitle } from './styled';

type Props = { onSelection: (walletType: WalletType) => void };

export const WalletSelector = ({ onSelection }: Props) => {
  return (
    <>
      <Subtitle>
        <FormattedMessage id="bc-wallet.select-a-wallet.subtitle" />
      </Subtitle>
      <OptionsContainer>
        <OptionItem
          onClick={() => onSelection('binance-chain-wallet')}
          icon={<Icon.BinanceChainWallet />}
          label={<FormattedMessage id="bc-wallet.option.binance-chain-wallet" />}
        />
        <OptionItem
          onClick={() => onSelection('wallet-connect')}
          icon={<Icon.WalletConnect />}
          label={<FormattedMessage id="bc-wallet.option.wallet-connect" />}
        />
      </OptionsContainer>
    </>
  );
};
