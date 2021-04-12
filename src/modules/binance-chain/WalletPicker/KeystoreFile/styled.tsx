import { rem, transitions, transparentize } from 'polished';
import styled, { css } from 'styled-components';

const dragActive = css`
  border-color: ${({ theme }) => theme.pulsar.color.primary.active};
  background: ${({ theme }) => transparentize(0.9, theme.pulsar.color.primary.active)};
`;

export const DropZone = styled.div<{ isDragActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};
  min-height: ${rem(100)};
  border: 3px dashed ${({ theme }) => theme.pulsar.color.border.normal};
  border-radius: ${({ theme }) => rem(theme.pulsar.size.room)};
  cursor: pointer;
  ${({ theme }) => transitions(['color', 'background', 'border'], theme.pulsar.duration.normal)};
  ${({ isDragActive }) => isDragActive && dragActive};

  :hover,
  :active {
    ${dragActive};
  }
`;
