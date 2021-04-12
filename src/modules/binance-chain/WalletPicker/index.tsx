import { Button, Icon, Modal } from '@swingby-protocol/pulsar';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { WalletType } from './WalletType';
import { Selector } from './Selector';

type Props = { open: boolean; onClose?: () => void };

export const WalletPicker = ({ open, onClose }: Props) => {
  const [walletType, setWalletType] = useState<WalletType>(null);
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Content>
        {(() => {
          switch (walletType) {
            case 'wallet-connect':
              return <>Wallet Connect</>;
            case 'ledger':
              return <>Ledger</>;
            case 'keystore-file':
              return <>Keystore File</>;
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
