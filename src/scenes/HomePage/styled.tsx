import { rem } from 'polished';
import styled from 'styled-components';

import { ConnectWallet } from './ConnectWallet';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: ${({ theme }) => rem(theme.pulsar.size.city)} 1fr ${({ theme }) =>
      rem(theme.pulsar.size.city)};
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0 ${({ theme }) => rem(theme.pulsar.size.city)};
`;

export const StyledConnectWallet = styled(ConnectWallet)`
  justify-self: flex-end;
`;
