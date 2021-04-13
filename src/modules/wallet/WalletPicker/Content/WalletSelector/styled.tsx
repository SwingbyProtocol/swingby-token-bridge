import { rem } from 'polished';
import styled from 'styled-components';

export const Subtitle = styled.div`
  font-size: ${({ theme }) => rem(theme.pulsar.size.room)};
`;

export const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${({ theme }) => rem(theme.pulsar.size.room)};
  margin-top: ${({ theme }) => rem(theme.pulsar.size.room)};
`;
