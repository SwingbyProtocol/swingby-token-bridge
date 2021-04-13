import { QRCode } from '@swingby-protocol/pulsar';
import { rem } from 'polished';
import styled from 'styled-components';

export const QrContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: ${rem(300)};
`;

export const StyledQRCode = styled(QRCode)`
  font-size: ${rem(300)};
`;
