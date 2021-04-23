import { Card } from '@swingby-protocol/pulsar';
import { rem } from 'polished';
import styled, { css } from 'styled-components';

export const Container = styled(Card)`
  align-self: stretch;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding: ${({ theme }) => rem(theme.pulsar.size.street)} 0;
`;

const even = css`
  background: ${({ theme }) => theme.pulsar.color.bg.accent};
`;

export const Item = styled.div<{ isEven: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 ${({ theme }) => rem(theme.pulsar.size.town)};
  ${({ isEven }) => isEven && even};

  > * {
    flex: 1;
  }

  > *:not(:first-child) {
    margin-left: ${({ theme }) => rem(theme.pulsar.size.town)};
  }

  > *:not(:last-child) {
    margin-right: ${({ theme }) => rem(theme.pulsar.size.town)};
  }
`;

export const ItemHashContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

export const ItemHash = styled.span`
  font-size: ${({ theme }) => rem(theme.pulsar.size.room)};
  font-weight: 600;
`;

export const ItemDate = styled.span`
  color: ${({ theme }) => theme.pulsar.color.text.masked};
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};
  font-weight: 500;
`;
