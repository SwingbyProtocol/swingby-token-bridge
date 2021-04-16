import { PulsarThemeProvider } from '@swingby-protocol/pulsar';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

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
  const { formatMessage } = useIntl();

  const text = useMemo(() => {
    const buildMessage = ({
      suffix,
      values,
    }: {
      suffix: string;
      values?: Parameters<typeof formatMessage>['1'];
    }) => {
      const id = `tx-toast.${toastId}.${suffix}`;
      const result = formatMessage({ id }, values);
      if (!result || result === id) {
        return formatMessage({ id: `tx-toast.transaction-result.${suffix}` }, values);
      }

      return result;
    };

    if (error) {
      return buildMessage({ suffix: 'bad' });
    }

    if (confirmations) {
      return buildMessage({ suffix: 'confirmed-by', values: { value: confirmations } });
    }

    if (typeof transactionStatus === 'boolean') {
      return transactionStatus ? buildMessage({ suffix: 'ok' }) : buildMessage({ suffix: 'bad' });
    }

    return buildMessage({ suffix: 'sent' });
  }, [confirmations, transactionStatus, error, toastId, formatMessage]);

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
