import { rem } from 'polished';
import styled from 'styled-components';

import { Divider } from './Divider';

export const StyledDivider = styled(Divider)`
  margin: ${({ theme }) => rem(theme.pulsar.size.street)} 0;
`;

export const ButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  margin-top: ${({ theme }) => rem(theme.pulsar.size.street)};
`;
