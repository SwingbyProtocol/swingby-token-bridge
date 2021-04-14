import { Button, Loading, TextInput } from '@swingby-protocol/pulsar';
import { Big } from 'big.js';
import { ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { logger } from '../../modules/logger';
import { useOnboard } from '../../modules/onboard';
import {
  approveHotWallet,
  getDestinationNetwork,
  getHotWalletAllowance,
  getSwingbyBalance,
} from '../../modules/web3';

import {
  Container,
  StyledConnectWallet,
  StyledCard,
  AmountContainer,
  MaxButton,
  ButtonsContainer,
} from './styled';

export const HomePage = () => {
  const { address, network, onboard } = useOnboard();
  const [amount, setAmount] = useState('');
  const [allowance, setAllowance] = useState(new Big(0));
  const [gettingMax, setGettingMax] = useState(false);
  const [approving, setApproving] = useState(false);

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
    } catch (err) {
      logger.debug({ err }, 'Failed to get balance');
    } finally {
      setGettingMax(false);
    }
  }, [onboard]);

  useEffect(() => {
    let cancelled = false;

    const updateAllowance = async () => {
      if (cancelled) return;

      try {
        setAllowance(new Big(await getHotWalletAllowance({ onboard })));
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
        <ButtonsContainer>
          <Button
            variant="primary"
            size="state"
            disabled={!address || !network || allowance.gte(parsedAmount ?? 0) || approving}
            onClick={async () => {
              if (!parsedAmount) return;
              try {
                setApproving(true);
                await approveHotWallet({ amount: parsedAmount, onboard });
              } finally {
                setApproving(false);
              }
            }}
          >
            {approving ? <Loading /> : <FormattedMessage id="form.approve-btn" />}
          </Button>
          <Button
            variant="primary"
            size="state"
            disabled={
              !address ||
              !network ||
              !parsedAmount?.gt(0) ||
              allowance.lt(parsedAmount) ||
              approving
            }
          >
            {network ? (
              <FormattedMessage
                id="form.swap-to-btn"
                values={{
                  network: (
                    <FormattedMessage id={`network.short.${getDestinationNetwork(network)}`} />
                  ),
                }}
              />
            ) : (
              <FormattedMessage id="form.swap-btn" />
            )}
          </Button>
        </ButtonsContainer>
      </StyledCard>
    </Container>
  );
};
