import { Card } from '@swingby-protocol/pulsar';
import { rem } from 'polished';
import styled from 'styled-components';

import { NetworkTag } from '../NetworkTag';

export const StyledCard = styled(Card)`
  display: grid;
  grid-template-columns: min-content auto;
  width: fit-content;
  grid-column-gap: ${({ theme }) => rem(theme.pulsar.size.closet)};
  grid-row-gap: ${({ theme }) => rem(theme.pulsar.size.box)};
  align-items: center;
`;

export const StyledNetworkTag = styled(NetworkTag)`
  width: 100%;
  justify-self: right;
`;

export const ItemAmount = styled.div`
  font-size: ${({ theme }) => rem(theme.pulsar.size.room)};
  font-weight: 500;
`;
