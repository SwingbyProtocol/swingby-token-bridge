import { Icon, Modal } from '@swingby-protocol/pulsar';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { WalletType } from './WalletType';
import { WalletConnect } from './WalletConnect';
import { WalletSelector } from './WalletSelector';
import { BackButton, Title, TitleIcon } from './styled';

type Props = { open: boolean; onClose?: () => void };

export const WalletPicker = ({ open, onClose }: Props) => {
  const [chainPicked, setChainPicked] = useState(false);
  const [walletType, setWalletType] = useState<WalletType>(null);
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Content>
        <Title>
          {walletType ? (
            <BackButton
              onClick={(evt) => {
                evt.preventDefault();
                evt.stopPropagation();
                setWalletType(null);
              }}
            >
              <Icon.ArrowLeft />
            </BackButton>
          ) : chainPicked ? (
            <BackButton
              onClick={(evt) => {
                evt.preventDefault();
                evt.stopPropagation();
                setChainPicked(false);
              }}
            >
              <Icon.ArrowLeft />
            </BackButton>
          ) : (
            <TitleIcon>
              <Icon.Wallet />
            </TitleIcon>
          )}
          &nbsp;
          {chainPicked ? (
            <FormattedMessage id={`bc-wallet.select-a-wallet.${walletType}.title`} />
          ) : (
            <FormattedMessage id="use-wallet.select-chain.title" />
          )}
        </Title>

        {(() => {
          if (!chainPicked) {
            return <WalletSelector onSelection={setWalletType} />;
          }

          switch (walletType) {
            case 'wallet-connect':
              return <WalletConnect />;
            case 'binance-chain-wallet':
              return <>Binance Chain Wallet</>;
            default:
              return <WalletSelector onSelection={setWalletType} />;
          }
        })()}
      </Modal.Content>
    </Modal>
  );
};
