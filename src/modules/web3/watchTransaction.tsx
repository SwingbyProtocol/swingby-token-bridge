import { createOrUpdateToast, updateToast } from '@swingby-protocol/pulsar';

import { logger } from '../logger';

import { TransferToast } from './TransferToast';

import type { TransactionReceipt } from 'web3-eth';
import type { PromiEvent } from 'web3-core';
import type { NetworkId } from '../onboard';

export const watchTransaction = ({
  network,
  tx,
  toastId = 'transaction-result',
}: {
  network: NetworkId;
  tx: PromiEvent<TransactionReceipt>;
  toastId?: string;
}) => {
  let transactionHash: string | null = null;

  tx.on('transactionHash', (hash) => {
    transactionHash = hash;

    createOrUpdateToast({
      content: <TransferToast transactionId={hash} network={network} toastId={toastId} />,
      type: 'default',
      toastId,
    });
  })
    .on('confirmation', (confirmations) => {
      updateToast({
        content: (
          <TransferToast
            transactionId={transactionHash}
            confirmations={confirmations}
            network={network}
            toastId={toastId}
          />
        ),
        type: 'success',
        toastId,
      });
    })
    .on('error', (error) => {
      logger.error(error);
      createOrUpdateToast({
        content: <TransferToast error={error} network={network} toastId={toastId} />,
        type: 'danger',
        toastId,
      });
    })
    .on('receipt', (receipt) => {
      createOrUpdateToast({
        content: (
          <TransferToast
            transactionId={transactionHash}
            transactionStatus={receipt.status}
            network={network}
            toastId={toastId}
          />
        ),
        type: receipt.status ? 'success' : 'danger',
        toastId,
      });
    });

  return tx;
};
