import { Modal } from '@swingby-protocol/pulsar';

import { Content } from './Content';

type Props = { open: boolean; onClose?: () => void };

export const WalletPicker = ({ open, onClose }: Props) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Content>
        <Content onClose={onClose} />
      </Modal.Content>
    </Modal>
  );
};
