import {
  Button,
  Loading,
  TextInput,
  createOrUpdateToast,
  dismissToast,
} from '@swingby-protocol/pulsar';
import { Big } from 'big.js';
import { ChangeEventHandler, useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { logger } from '../../modules/logger';
import { useOnboard } from '../../modules/onboard';
import { getDestinationNetwork, getSwingbyBalance, transferToHotWallet } from '../../modules/web3';
import { isTransactionHistoryEnabled } from '../../modules/env';

import {
  Container,
  StyledConnectWallet,
  StyledCard,
  AmountContainer,
  MaxButton,
  ButtonsContainer,
  FeeContainer,
} from './styled';
import { useSwapFee } from './useSwapFee';
import { SwapToBep2 } from './SwapToBep2';
import { TransactionHistory } from './TransactionHistory';

const TOAST_ID_GET_MAX = 'get-max';

export const HomePage = () => {
  const { address, network, onboard } = useOnboard();
  const [amount, setAmount] = useState('');
  const [gettingMax, setGettingMax] = useState(false);
  const [transferring, setTrasferring] = useState(false);
  const { data: feeData, node: feeNode } = useSwapFee();

  const parsedAmount = useMemo(() => {
    try {
      return new Big(amount);
    } catch (e) {
      return null;
    }
  }, [amount]);

  const amountChanged = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (evt) => setAmount(evt.target.value),
    [],
  );

  const getMax = useCallback(async () => {
    try {
      setGettingMax(true);
      setAmount(await getSwingbyBalance({ onboard }));
      dismissToast({ toastId: TOAST_ID_GET_MAX });
    } catch (err) {
      logger.debug({ err }, 'Failed to get balance');
      createOrUpdateToast({
        content: 'Failed to get balance',
        type: 'danger',
        toastId: TOAST_ID_GET_MAX,
      });
    } finally {
      setGettingMax(false);
    }
  }, [onboard]);

  const transfer = useCallback(async () => {
    if (!parsedAmount) return;
    try {
      setTrasferring(true);
      await transferToHotWallet({ amount: parsedAmount, onboard });
    } catch (err) {
    } finally {
      setTrasferring(false);
    }
  }, [onboard, parsedAmount]);

  return (
    <Container>
      <StyledConnectWallet />
      <StyledCard size="town">
        <AmountContainer>
          <TextInput size="state" value={amount} onChange={amountChanged} placeholder="0" />
          <MaxButton
            variant="secondary"
            size="street"
            shape="fit"
            disabled={!address || !network || gettingMax}
            onClick={getMax}
          >
            {gettingMax ? <Loading /> : <FormattedMessage id="form.max-btn" />}
          </MaxButton>
        </AmountContainer>
        <FeeContainer>{feeNode}</FeeContainer>
        <ButtonsContainer>
          <div />
          <Button
            variant="primary"
            size="state"
            disabled={
              !address ||
              !network ||
              !parsedAmount?.gt(0) ||
              transferring ||
              !feeData ||
              parsedAmount.lt(feeData.minimumSwapSwingby)
            }
            onClick={transfer}
          >
            {(() => {
              if (transferring) {
                return <Loading />;
              }

              if (network) {
                return (
                  <FormattedMessage
                    id="form.swap-to-btn"
                    values={{
                      network: (
                        <FormattedMessage id={`network.short.${getDestinationNetwork(network)}`} />
                      ),
                    }}
                  />
                );
              }

              return <FormattedMessage id="form.swap-btn" />;
            })()}
          </Button>
        </ButtonsContainer>
        <SwapToBep2 amount={parsedAmount} />
      </StyledCard>
      {!!address && !!network && isTransactionHistoryEnabled && <TransactionHistory />}
    </Container>
  );
};
