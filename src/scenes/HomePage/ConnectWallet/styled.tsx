import { rem, transitions, transparentize } from 'polished';
import styled, { css } from 'styled-components';

import type { NetworkId } from '../../../modules/web3';

const COLOR_ETH = '#8892b5';
const COLOR_BSC = '#f0b90b';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const eth = css`
  background: ${COLOR_ETH};
  color: ${({ theme }) => theme.pulsar.color.danger.text};
`;

const goerli = css`
  background: ${transparentize(0.5, COLOR_ETH)};
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 5px,
    ${COLOR_ETH} 5px,
    ${COLOR_ETH} 10px
  );
  color: ${({ theme }) => theme.pulsar.color.danger.text};
`;

const bsc = css`
  background: ${COLOR_BSC};
  color: ${({ theme }) => theme.pulsar.color.warning.text};
`;

const bsct = css`
  background: ${transparentize(0.5, COLOR_BSC)};
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 5px,
    ${COLOR_BSC} 5px,
    ${COLOR_BSC} 10px
  );
  color: ${({ theme }) => theme.pulsar.color.warning.text};
`;

export const Network = styled.div<{ value: NetworkId | null }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${({ theme }) => rem(theme.pulsar.size.street)};
  border-radius: ${({ theme }) => rem(theme.pulsar.size.street / 2)};
  padding: 0 ${({ theme }) => rem(theme.pulsar.size.closet)};
  margin-right: ${({ theme }) => rem(theme.pulsar.size.closet)};
  background: ${({ theme }) => theme.pulsar.color.danger.normal};
  color: ${({ theme }) => theme.pulsar.color.danger.text};
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};
  font-weight: 600;
  user-select: none;
  cursor: auto;
  ${({ theme }) => transitions(['color', 'background'], theme.pulsar.duration.normal)};
  ${({ value }) => value === 1 && eth};
  ${({ value }) => value === 5 && goerli};
  ${({ value }) => value === 56 && bsc};
  ${({ value }) => value === 97 && bsct};
`;
