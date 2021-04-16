import { Button } from '@swingby-protocol/pulsar';
import { rem } from 'polished';
import styled from 'styled-components';

export const SuccessToastContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const StyledToastButton = styled(Button)`
  margin-right: ${({ theme }) => rem(theme.pulsar.size.box)};
`;
