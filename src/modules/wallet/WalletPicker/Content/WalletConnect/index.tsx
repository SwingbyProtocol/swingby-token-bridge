import { Loading } from '@swingby-protocol/pulsar';
import { useEffect, useState } from 'react';

import { useInternalContext } from '../../../internal-context';

import { QrContainer, StyledQRCode } from './styled';

export const WalletConnect = () => {
  const [connectUri, setConnectUri] = useState<string | null>();
  const { walletConnect } = useInternalContext();

  useEffect(() => {
    if (walletConnect.address) {
      return;
    }

    (async () => {
      if (walletConnect.instance.connected) {
        try {
          await walletConnect.instance.killSession();
        } catch (e) {}
      }

      await walletConnect.instance.createSession();
      setConnectUri(walletConnect.instance.uri);
    })();
  }, [walletConnect]);

  return (
    <QrContainer>{connectUri ? <StyledQRCode value={connectUri} /> : <Loading />}</QrContainer>
  );
};
