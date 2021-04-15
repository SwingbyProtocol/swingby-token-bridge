import { Button, createOrUpdateToast, dismissToast, Loading } from '@swingby-protocol/pulsar';
import { Big } from 'big.js';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { logger } from '../../../modules/logger';
import { useOnboard } from '../../../modules/onboard';
import { approveBep20CrossChainTransfer, getBep20CrossChainAllowance } from '../../../modules/web3';

import { StyledDivider, ButtonsContainer } from './styled';

const TOAST_ID_APPROVE = 'approve-bep20';

export const SwapToBep2 = ({ amount }: { amount: Big | null }) => {
  const { address, network, onboard } = useOnboard();
  const [allowance, setAllowance] = useState(new Big(0));
  const [approving, setApproving] = useState(false);

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

  useEffect(() => {
    let cancelled = false;

    const updateAllowance = async () => {
      if (cancelled) return;

      try {
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
          disabled={!address || !network || !amount?.gt(0) || allowance.lt(amount) || approving}
        >
          <FormattedMessage id="form.swap-btn" />
        </Button>
      </ButtonsContainer>
    </>
  );
};
