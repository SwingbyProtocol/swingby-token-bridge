import { Button, TextInput } from '@swingby-protocol/pulsar';
import { Big } from 'big.js';
import { ChangeEventHandler, useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { useOnboard } from '../../modules/onboard';
import { useGetSwingbyBalance } from '../../modules/web3';

import { Container, StyledConnectWallet, StyledCard, AmountContainer, MaxButton } from './styled';

export const HomePage = () => {
  const { address, network } = useOnboard();
  const [amount, setAmount] = useState('');
  const { getSwingbyBalance } = useGetSwingbyBalance();

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
    setAmount(await getSwingbyBalance());
  }, [getSwingbyBalance]);

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
            disabled={!address || !network}
            onClick={getMax}
          >
            <FormattedMessage id="form.max-btn" />
          </MaxButton>
        </AmountContainer>
        <Button
          variant="primary"
          size="state"
          disabled={!address || !network || !parsedAmount?.gt(0)}
        >
          <FormattedMessage id="form.swap-btn" />
        </Button>
      </StyledCard>
    </Container>
  );
};
