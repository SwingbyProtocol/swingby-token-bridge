import { Card } from '@swingby-protocol/pulsar';
import { rem } from 'polished';
import styled from 'styled-components';

export const Container = styled(Card)`
  height: 100%;
  padding: ${({ theme }) => rem(theme.pulsar.size.town)};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
`;
