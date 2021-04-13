import { createGlobalStyle as css } from 'styled-components';

export const GlobalStyles = css`
  :root {
    background: ${({ theme }) => theme.pulsar.color.bg.masked};
  }

  a,
  a:visited {
    color: inherit;
    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.pulsar.color.primary.normal};
  }
`;
