import { Button, TextInput } from '@swingby-protocol/pulsar';
import Big from 'big.js';
import { useMemo, useState } from 'react';

import { useOnboard } from '../../modules/web3';

import { Container, StyledConnectWallet, StyledCard, AmountContainer, MaxButton } from './styled';

export const HomePage = () => {
  const { address, network } = useOnboard();
  const [amount, setAmount] = useState('');

  const parsedAmount = useMemo(() => {
    try {
      return new Big(amount);
    } catch (e) {
      return null;
    }
  }, [amount]);

  return (
    <Container>
      <StyledConnectWallet />
      <StyledCard size="town">
        <AmountContainer>
          <TextInput
            size="state"
            value={amount}
            onChange={(evt) => setAmount(evt.target.value)}
            placeholder="0"
          />
          <MaxButton variant="secondary" size="street" shape="fit" disabled={!address || !network}>
            MAX
          </MaxButton>
        </AmountContainer>
        <Button
          variant="primary"
          size="state"
          disabled={!address || !network || !parsedAmount?.gt(0)}
        >
          Swap
        </Button>
      </StyledCard>
    </Container>
  );
};
