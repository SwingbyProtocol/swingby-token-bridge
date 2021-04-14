import { rem } from 'polished';
import { createGlobalStyle as css } from 'styled-components';

export const OnboardGlobalStyles = css`
  .bn-onboard-custom {
    .bn-onboard-modal-content {
      max-width: none;
      max-height: none;
      width: calc(100vw - ${({ theme }) => rem(theme.pulsar.size.room)});
      height: calc(100vh - ${({ theme }) => rem(theme.pulsar.size.room)});
      padding: ${({ theme }) => rem(theme.pulsar.size.room)};
      border-radius: 0;

      @media (min-height: ${rem(600)}) {
        max-width: 37em;
        max-height: none;
        width: auto;
        height: auto;
        padding: ${({ theme }) => rem(theme.pulsar.size.room)};
        border-radius: ${({ theme }) => rem(theme.pulsar.size.closet)};
      }
    }
  }
`;
