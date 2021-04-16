import {
  Button,
  createOrUpdateToast,
  dismissToast,
  Loading,
  TextInput,
} from '@swingby-protocol/pulsar';
import { Big } from 'big.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { isAddressValid } from 'binance-chain-sdk-lite';

import { logger } from '../../../modules/logger';
import { useOnboard } from '../../../modules/onboard';
import {
  approveBep20CrossChainTransfer,
  doBep20CrossChainTransfer,
  getBep20CrossChainAllowance,
} from '../../../modules/web3';

import { StyledDivider, ButtonsContainer } from './styled';

const TOAST_ID_APPROVE = 'approve-bep20';
const TOAST_ID_RUN = 'cross-chain-bep20';

export const SwapToBep2 = ({ amount }: { amount: Big | null }) => {
  const { address, network, onboard } = useOnboard();
  const [allowance, setAllowance] = useState(new Big(0));
  const [approving, setApproving] = useState(false);
  const [running, setRunning] = useState(false);
  const [bcAddress, setBcAddress] = useState('');

  const isBcAddressValid = useMemo(
    () =>
      isAddressValid({
        address: bcAddress,
        context: { mode: network === 97 ? 'test' : 'production' },
      }),
    [network, bcAddress],
  );

  const approveAmount = useCallback(async () => {
    if (!amount) return;
    try {
      setApproving(true);
      await approveBep20CrossChainTransfer({ amount, onboard });
      dismissToast({ toastId: TOAST_ID_APPROVE });
    } catch (err) {
      logger.error({ err }, 'Failed to approve');
      createOrUpdateToast({
        content: 'Failed to approve' + (err.message ? `: ${err.message}` : ''),
        type: 'danger',
        toastId: TOAST_ID_APPROVE,
      });
    } finally {
      setApproving(false);
    }
  }, [onboard, amount]);

  const runCrossChainTransfer = useCallback(async () => {
    if (!amount) return;
    try {
      setRunning(true);
      await doBep20CrossChainTransfer({ amount, onboard, addressReceiving: bcAddress });
      dismissToast({ toastId: TOAST_ID_RUN });
    } catch (err) {
      logger.error({ err }, 'Failed to perform cross-chain transfer');
      createOrUpdateToast({
        content: 'Transaction failed' + (err.message ? `: ${err.message}` : ''),
        type: 'danger',
        toastId: TOAST_ID_RUN,
      });
    } finally {
      setRunning(false);
    }
  }, [onboard, amount, bcAddress]);

  useEffect(() => {
    let cancelled = false;

    const updateAllowance = async () => {
      if (cancelled) return;

      try {
        logger.debug('Will get cross-chain contract allowance');
        setAllowance(new Big(await getBep20CrossChainAllowance({ onboard })));
        setTimeout(updateAllowance, 5000);
      } catch (err) {
        logger.debug({ err }, 'Failed to get allowance');
      }
    };

    updateAllowance();

    return () => {
      cancelled = true;
    };
  }, [onboard]);

  if (network !== 56 && network !== 97) {
    return <></>;
  }

  return (
    <>
      <StyledDivider />
      <TextInput
        size="state"
        value={bcAddress}
        onChange={(evt) => setBcAddress(evt.target.value)}
        state={!bcAddress || isBcAddressValid ? 'normal' : 'danger'}
        label={<FormattedMessage id="form.bsc-bc.input.label" />}
        placeholder={
          network === 97
            ? 'tbnb1mpg44t3mzr0yyx76s2vzhhqg5jngfamdwww69k'
            : 'bnb1thagrtfude74x2j2wuknhj2savucy2tx0k58y9'
        }
      />
      <ButtonsContainer>
        <Button
          variant="secondary"
          size="state"
          disabled={!address || !network || allowance.gte(amount ?? 0) || approving}
          onClick={approveAmount}
        >
          {approving ? <Loading /> : <FormattedMessage id="form.approve-btn" />}
        </Button>
        <Button
          variant="secondary"
          size="state"
          disabled={
            !address ||
            !network ||
            !amount?.gt(0) ||
            allowance.lt(amount) ||
            approving ||
            running ||
            !isBcAddressValid
          }
          onClick={runCrossChainTransfer}
        >
          {running ? (
            <Loading />
          ) : (
            <FormattedMessage
              id="form.swap-to-btn"
              values={{
                network: <FormattedMessage id={`network.short.${network === 97 ? 'bct' : 'bc'}`} />,
              }}
            />
          )}
        </Button>
      </ButtonsContainer>
    </>
  );
};
