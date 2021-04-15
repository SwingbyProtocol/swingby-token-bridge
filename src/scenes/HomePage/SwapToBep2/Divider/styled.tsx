import { rem } from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};
  color: ${({ theme }) => theme.pulsar.color.text.masked};
  user-select: none;
  pointer-events: none;
  cursor: auto;

  :before,
  :after {
    content: '';
    display: block;
    height: 1px;
    background: currentColor;
    flex: 1;
  }

  :before {
    margin-right: ${({ theme }) => rem(theme.pulsar.size.box)};
  }

  :after {
    margin-left: ${({ theme }) => rem(theme.pulsar.size.box)};
  }
`;
