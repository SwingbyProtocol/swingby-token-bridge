import { useDepositsHistoryQuery } from '../../../generated/graphql';
import { useOnboard } from '../../../modules/onboard';

import { Container } from './styled';

export const TransactionHistory = () => {
  const { address } = useOnboard();
  if (!address) {
    throw new Error('Not connected to a wallet');
  }

  const { data } = useDepositsHistoryQuery();
  if (!data) {
    return <></>;
  }

  return (
    <Container size="bare">
      {data.deposits.edges.map((it) => (
        <div>{JSON.stringify(it)}</div>
      ))}
    </Container>
  );
};
