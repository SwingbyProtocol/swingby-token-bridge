import { rem } from 'polished';
import styled from 'styled-components';

import { Divider } from './Divider';

export const StyledDivider = styled(Divider)`
  margin: ${({ theme }) => rem(theme.pulsar.size.street)} 0;
`;
