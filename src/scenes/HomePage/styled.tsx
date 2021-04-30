import { Button, Card } from '@swingby-protocol/pulsar';
import { rem } from 'polished';
import styled from 'styled-components';

import { SupplyInfo } from '../../components/SupplyInfo';

import { ConnectWallet } from './ConnectWallet';

const MEDIA = `(min-width: ${rem(768)})`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: ${({ theme }) => rem(theme.pulsar.size.city)} min-content auto 1fr;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0 ${({ theme }) => rem(theme.pulsar.size.drawer)};
`;

export const StyledConnectWallet = styled(ConnectWallet)`
  justify-self: flex-end;
`;

export const StyledSupplyInfo = styled(SupplyInfo)`
  width: 100%;
  margin-top: ${({ theme }) => rem(theme.pulsar.size.closet)};

  @media ${MEDIA} {
    width: ${rem(450)};
    justify-self: center;
  }
`;

export const StyledCard = styled(Card)`
  margin-top: ${({ theme }) => rem(theme.pulsar.size.state)};
  margin-bottom: ${({ theme }) => rem(theme.pulsar.size.country)};

  @media ${MEDIA} {
    width: ${rem(450)};
    justify-self: center;
  }
`;

export const AmountContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const FeeContainer = styled.div`
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};
  margin-top: ${({ theme }) => rem(theme.pulsar.size.box)};
  margin-bottom: ${({ theme }) => rem(theme.pulsar.size.street)};
`;

export const MaxButton = styled(Button)`
  margin-left: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  padding: 0 ${({ theme }) => rem(theme.pulsar.size.box)};
`;

export const ButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${({ theme }) => rem(theme.pulsar.size.drawer)};
`;
