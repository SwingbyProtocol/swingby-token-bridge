import { Icon, Modal } from '@swingby-protocol/pulsar';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { WalletType } from './WalletType';
import { Selector } from './Selector';
import { KeystoreFile } from './KeystoreFile';
import { BackButton, Title, TitleIcon } from './styled';

type Props = { open: boolean; onClose?: () => void };

export const WalletPicker = ({ open, onClose }: Props) => {
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
          ) : (
            <TitleIcon>
              <Icon.Wallet />
            </TitleIcon>
          )}
          &nbsp;
          <FormattedMessage id={`bc-wallet.select-a-wallet.${walletType}.title`} />
        </Title>

        {(() => {
          switch (walletType) {
            case 'wallet-connect':
              return <>Wallet Connect</>;
            case 'ledger':
              return <>Ledger</>;
            case 'keystore-file':
              return <KeystoreFile />;
            case 'seed-phrase':
              return <>Seed Phrase</>;
            default:
              return <Selector onSelection={setWalletType} />;
          }
        })()}
      </Modal.Content>
    </Modal>
  );
};
