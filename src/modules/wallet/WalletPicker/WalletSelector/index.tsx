import { Icon } from '@swingby-protocol/pulsar';
import { FormattedMessage } from 'react-intl';

import { WalletType } from '../WalletType';

import { OptionsContainer, Item, ItemIcon, Subtitle } from './styled';

type Props = { onSelection: (walletType: WalletType) => void };

export const WalletSelector = ({ onSelection }: Props) => {
  return (
    <>
      <Subtitle>
        <FormattedMessage id="bc-wallet.select-a-wallet.subtitle" />
      </Subtitle>
      <OptionsContainer>
        <Item
          onClick={(evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            onSelection('binance-chain-wallet');
          }}
        >
          <ItemIcon>
            <Icon.BinanceChainWallet />
          </ItemIcon>
          &nbsp;
          <FormattedMessage id="bc-wallet.option.binance-chain-wallet" />
        </Item>
        <Item
          onClick={(evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            onSelection('wallet-connect');
          }}
        >
          <ItemIcon>
            <Icon.WalletConnect />
          </ItemIcon>
          &nbsp;
          <FormattedMessage id="bc-wallet.option.wallet-connect" />
        </Item>
      </OptionsContainer>
    </>
  );
};
