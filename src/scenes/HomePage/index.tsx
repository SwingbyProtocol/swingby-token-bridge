import { Card } from '@swingby-protocol/pulsar';

import { ConnectWallet } from './ConnectWallet';
import { Container } from './styled';

export const HomePage = () => {
  return (
    <Container>
      <ConnectWallet />
      <Card size="town">aaaa</Card>
    </Container>
  );
};
