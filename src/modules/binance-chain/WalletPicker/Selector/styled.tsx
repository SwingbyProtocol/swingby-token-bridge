import { rem, transitions } from 'polished';
import styled from 'styled-components';

export const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${({ theme }) => rem(theme.pulsar.size.room)};
`;

export const Item = styled.button`
  background: ${({ theme }) => theme.pulsar.color.bg.accent};
  border: none;
  color: inherit;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-size: ${({ theme }) => rem(theme.pulsar.size.room)};
  font-weight: 500;
  border-radius: ${({ theme }) => rem(theme.pulsar.size.country / 2)};
  height: ${({ theme }) => rem(theme.pulsar.size.country)};
  padding: 0 ${({ theme }) => rem(theme.pulsar.size.street)};
  cursor: pointer;
  ${({ theme }) => transitions(['color', 'background'], theme.pulsar.duration.normal)};

  :hover,
  :active {
    background: ${({ theme }) => theme.pulsar.color.primary.active};
    color: ${({ theme }) => theme.pulsar.color.primary.text};
  }
`;

export const ItemIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => rem(theme.pulsar.size.town)};
  margin-right: ${({ theme }) => rem(theme.pulsar.size.drawer)};
`;
