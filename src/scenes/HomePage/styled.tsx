import { Button, Card } from '@swingby-protocol/pulsar';
import { rem } from 'polished';
import styled from 'styled-components';

import { SupplyInfo } from '../../components/SupplyInfo';

import { ConnectWallet } from './ConnectWallet';

const MEDIA = `(min-width: ${rem(768)})`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: min-content min-content auto 1fr;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0 ${({ theme }) => rem(theme.pulsar.size.drawer)};
  padding-top: ${({ theme }) => rem(theme.pulsar.size.drawer)};
`;

export const StyledConnectWallet = styled(ConnectWallet)`
  justify-self: flex-end;
  margin-bottom: ${({ theme }) => rem(theme.pulsar.size.drawer)};
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
  margin-top: ${({ theme }) => rem(theme.pulsar.size.drawer)};
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

export const Guideline = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${({ theme }) => rem(theme.pulsar.size.house)};
  padding-top: ${({ theme }) => rem(theme.pulsar.size.room)};
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};
  row-gap: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  border-top: 1px solid ${({ theme }) => theme.pulsar.color.border.normal};
`;

export const TitleGuideline = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => rem(theme.pulsar.size.box)};
  font-size: ${({ theme }) => rem(theme.pulsar.size.house)};
`;

export const RowTutorial = styled.div`
  display: flex;
  column-gap: ${({ theme }) => rem(theme.pulsar.size.room)};
`;
