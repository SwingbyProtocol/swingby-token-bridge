import { rem, transitions } from 'polished';
import styled from 'styled-components';

export const Title = styled.h1`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: ${({ theme }) => rem(theme.pulsar.size.street)};
  font-weight: 600;
`;

export const TitleIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => rem(theme.pulsar.size.town)};
  margin-right: ${({ theme }) => rem(theme.pulsar.size.drawer)};
`;

export const BackButton = styled.button`
  background: ${({ theme }) => theme.pulsar.color.bg.accent};
  padding: 0;
  border: none;
  border-radius: 100%;
  color: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: ${({ theme }) => rem(theme.pulsar.size.town)};
  width: ${({ theme }) => rem(theme.pulsar.size.town)};
  font-size: ${({ theme }) => rem(theme.pulsar.size.house)};
  margin-right: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  cursor: pointer;
  ${({ theme }) => transitions(['color', 'background'], theme.pulsar.duration.normal)};

  :hover,
  :active {
    background: ${({ theme }) => theme.pulsar.color.primary.active};
    color: ${({ theme }) => theme.pulsar.color.primary.text};
  }
`;
