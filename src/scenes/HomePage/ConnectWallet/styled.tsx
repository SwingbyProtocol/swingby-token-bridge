import { Button } from '@swingby-protocol/pulsar';
import { rem } from 'polished';
import styled from 'styled-components';

import { NetworkTag } from '../../../components/NetworkTag';

const MEDIA = `(min-width: ${rem(500)})`;

export const Container = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
  justify-content: center;

  @media ${MEDIA} {
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
`;

export const WalletWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

export const StyledNetworkTag = styled(NetworkTag)`
  margin-right: ${({ theme }) => rem(theme.pulsar.size.closet)};
`;

export const StyledAddTokenButton = styled(Button)`
  margin-top: ${({ theme }) => rem(theme.pulsar.size.closet)};

  @media ${MEDIA} {
    margin-top: 0;
    margin-right: ${({ theme }) => rem(theme.pulsar.size.closet)};
  }
`;
