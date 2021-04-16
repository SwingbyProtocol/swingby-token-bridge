import { PulsarThemeProvider } from '@swingby-protocol/pulsar';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { NetworkId } from '../../onboard';

import { SuccessToastContainer, StyledToastButton } from './styled';

type Props = {
  transactionId?: string | null;
  confirmations?: number | null;
  transactionStatus?: boolean | null;
  error?: Error | null;
  network: NetworkId;
  toastId: string;
};

export const TransferToast = ({
  transactionId,
  confirmations,
  transactionStatus,
  error,
  network,
  toastId,
}: Props) => {
  const text = useMemo(() => {
    if (error) {
      return <FormattedMessage id={`tx-toast.${toastId}.bad`} />;
    }

    if (confirmations) {
      return (
        <FormattedMessage
          id={`tx-toast.${toastId}.confirmed-by`}
          values={{ value: confirmations }}
        />
      );
    }

    if (typeof transactionStatus === 'boolean') {
      return transactionStatus ? (
        <FormattedMessage id={`tx-toast.${toastId}.ok`} />
      ) : (
        <FormattedMessage id={`tx-toast.${toastId}.bad`} />
      );
    }

    return <FormattedMessage id={`tx-toast.${toastId}.sent`} />;
  }, [confirmations, transactionStatus, error, toastId]);

  return (
    <PulsarThemeProvider>
      <SuccessToastContainer>
        {text}
        {transactionId && (
          <StyledToastButton
            variant="secondary"
            size="street"
            shape="fit"
            href={(() => {
              switch (network) {
                case 1:
                  return `https://etherscan.io/tx/${transactionId}`;
                case 5:
                  return `https://goerli.etherscan.io/tx/${transactionId}`;
                case 56:
                  return `https://bscscan.com/tx/${transactionId}`;
                case 97:
                  return `https://testnet.bscscan.com/tx/${transactionId}`;
                default:
                  return undefined;
              }
            })()}
            target="_blank"
          >
            <FormattedMessage id="tx-toast.explorer" />
          </StyledToastButton>
        )}
      </SuccessToastContainer>
    </PulsarThemeProvider>
  );
};
