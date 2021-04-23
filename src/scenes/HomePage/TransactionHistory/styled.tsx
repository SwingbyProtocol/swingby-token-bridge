import { Card } from '@swingby-protocol/pulsar';
import { rem } from 'polished';
import styled from 'styled-components';

export const Container = styled(Card)`
  height: 100%;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
`;

export const Item = styled.div`
  padding: ${({ theme }) => rem(theme.pulsar.size.town)};
`;
