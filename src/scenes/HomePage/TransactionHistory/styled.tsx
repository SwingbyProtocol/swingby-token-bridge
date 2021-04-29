import { Card } from '@swingby-protocol/pulsar';
import { rem } from 'polished';
import styled, { css } from 'styled-components';

import { NetworkTag } from '../../../components/NetworkTag';

export const WIDE_SCREEN = `(min-width: ${rem(768)})`;

export const Container = styled(Card)`
  align-self: stretch;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
`;

const even = css`
  background: ${({ theme }) => theme.pulsar.color.bg.accent};
`;

export const Item = styled.div<{ isEven: boolean }>`
  display: grid;
  align-items: center;
  justify-items: left;
  grid-template-columns: 1fr min-content 1fr;
  grid-gap: ${({ theme }) => rem(theme.pulsar.size.town)};
  padding: 0 ${({ theme }) => rem(theme.pulsar.size.town)};
  ${({ isEven }) => isEven && even};
`;

export const SideContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
  height: 100%;

  @media ${WIDE_SCREEN} {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
`;

const warning = css`
  background: ${({ theme }) => theme.pulsar.color.warning.normal};
  color: ${({ theme }) => theme.pulsar.color.warning.text};
`;

const danger = css`
  background: ${({ theme }) => theme.pulsar.color.danger.normal};
  color: ${({ theme }) => theme.pulsar.color.danger.text};
`;

const success = css`
  background: ${({ theme }) => theme.pulsar.color.success.normal};
  color: ${({ theme }) => theme.pulsar.color.success.text};
`;

export const Arrow = styled.div<{ status: 'warning' | 'danger' | 'success' }>`
  flex-grow: 0;
  flex-shrink: 0;
  width: ${({ theme }) => rem(theme.pulsar.size.town)};
  height: ${({ theme }) => rem(theme.pulsar.size.town)};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ status }) => status === 'success' && success};
  ${({ status }) => status === 'warning' && warning};
  ${({ status }) => status === 'danger' && danger};
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

export const AmountContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-size: ${({ theme }) => rem(theme.pulsar.size.room)};
  margin-top: ${({ theme }) => rem(theme.pulsar.size.box)};

  @media ${WIDE_SCREEN} {
    font-size: ${({ theme }) => rem(theme.pulsar.size.house)};
    margin-top: 0;
    margin-left: ${({ theme }) => rem(theme.pulsar.size.town)};
  }
`;

export const Amount = styled.span`
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};
  font-weight: 600;

  @media ${WIDE_SCREEN} {
    font-size: ${({ theme }) => rem(theme.pulsar.size.room)};
  }
`;

export const StyledNetworkTag = styled(NetworkTag)`
  width: fit-content;
  font-size: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  margin-bottom: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  justify-self: flex-start;

  @media ${WIDE_SCREEN} {
    margin-bottom: 0;
    margin-right: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  }
`;
