import { useOnboard } from '../../../modules/onboard';

import { Container } from './styled';

export const TransactionHistory = () => {
  const { address } = useOnboard();

  if (!address) {
    return <>{null}</>;
  }

  return <Container size="bare">{address}</Container>;
};
