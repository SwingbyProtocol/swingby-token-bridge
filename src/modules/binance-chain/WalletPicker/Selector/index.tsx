import { Icon } from '@swingby-protocol/pulsar';
import { FormattedMessage } from 'react-intl';

import { WalletType } from '../WalletType';

import { OptionsContainer, Item, ItemIcon } from './styled';

type Props = { onSelection: (walletType: WalletType) => void };

export const Selector = ({ onSelection }: Props) => {
  return (
    <>
      <FormattedMessage id="bc-wallet.select-a-wallet" />
      <OptionsContainer>
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
        <Item
          onClick={(evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            onSelection('ledger');
          }}
        >
          <ItemIcon>
            <Icon.Ledger />
          </ItemIcon>
          &nbsp;
          <FormattedMessage id="bc-wallet.option.ledger" />
        </Item>
        <Item
          onClick={(evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            onSelection('keystore-file');
          }}
        >
          <ItemIcon>
            <Icon.PrivateKey />
          </ItemIcon>
          &nbsp;
          <FormattedMessage id="bc-wallet.option.keystore-file" />
        </Item>
        <Item
          onClick={(evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            onSelection('seed-phrase');
          }}
        >
          <ItemIcon>
            <Icon.SeedPhrase />
          </ItemIcon>
          &nbsp;
          <FormattedMessage id="bc-wallet.option.seed-phrase" />
        </Item>
      </OptionsContainer>
    </>
  );
};
