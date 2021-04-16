import { Button, Icon, Loading, TextInput } from '@swingby-protocol/pulsar';
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
    } catch (e) {
    } finally {
      setApproving(false);
    }
  }, [onboard, amount]);

  const runCrossChainTransfer = useCallback(async () => {
    if (!amount) return;
    try {
      setRunning(true);
      await doBep20CrossChainTransfer({ amount, onboard, addressReceiving: bcAddress });
    } catch (e) {
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
      } catch (err) {
        logger.debug({ err }, 'Failed to get allowance');
      } finally {
        setTimeout(updateAllowance, 5000);
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
          disabled={
            !address || !network || !amount || amount.lte(0) || allowance.gte(amount) || approving
          }
          onClick={approveAmount}
        >
          {(() => {
            if (approving) {
              return <Loading />;
            }

            if (amount && amount.gt(0) && allowance.gte(amount)) {
              return <Icon.Tick />;
            }

            return <FormattedMessage id="form.approve-btn" />;
          })()}
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
