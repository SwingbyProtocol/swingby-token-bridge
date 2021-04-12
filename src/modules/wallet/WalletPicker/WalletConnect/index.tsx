import WalletConnectClient from '@walletconnect/client';
import { useEffect, useState } from 'react';
import { QRCode } from '@swingby-protocol/pulsar';

import { QrContainer } from './styled';

const NETWORK_ID = 'Binance-Chain-Tigris';

export const WalletConnect = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [uri, setUri] = useState('');

  useEffect(() => {
    (async () => {
      const walletConnect = new MyWalletConnect({ bridge: 'https://bridge.walletconnect.org' });
      if (!walletConnect.connected) {
        walletConnect.createSession().then(() => {
          const uri = walletConnect.uri;
          setTimeout(() => {
            setUri(uri);
          }, 1200);
        });
      } else {
        walletConnect.killSession();
      }

      walletConnect.on('connect', (error, payload) => {
        if (error) {
          throw error;
        }
        const request = walletConnect._formatRequest({
          method: 'get_accounts',
        });

        walletConnect
          ._sendCallRequest(request)
          .then((result) => {
            const account = result.find((account) => account.network === NETWORK_ID);
            setWallet({
              walletconnect: walletConnect,
              address: account.address,
              account,
            });
          })
          .catch((error) => {
            // Error returned when rejected
            console.error(error);
          });
      });

      walletConnect.on('session_update', (error, payload) => {
        if (error) {
          throw error;
        }

        // Get updated accounts and chainId
        // const { accounts, chainId } = payload.params[0];
      });

      walletConnect.on('disconnect', (error, payload) => {
        console.log('Disconnect wallet connect');
        if (error) {
          throw error;
        }

        setWallet(null);
      });
    })();
  }, []);

  return (
    <>
      {uri ? (
        <QrContainer>
          <QRCode value={uri} />
        </QrContainer>
      ) : null}
    </>
  );
};

class MyWalletConnect extends WalletConnectClient {
  static METHOD_SIGN = 'bnb_sign';
  static METHOD_CONFIRM = 'bnb_tx_confirmation';

  constructor(props) {
    super(props);
    this._connector = null;
  }

  async sendTransaction(signDocObj) {
    if (!signDocObj || typeof signDocObj !== 'object') {
      throw new Error('sendTransaction expected a `signDocObj` of type `object`');
    }
    const customRequest = {
      id: 1,
      jsonrpc: '2.0',
      method: MyWalletConnect.METHOD_SIGN,
      params: [signDocObj],
    };
    return this.sendCustomRequest(customRequest);
  }

  async sendConfirmation(ok = true, errorMsg = null) {
    if (typeof ok !== 'boolean') {
      throw new Error('sendConfirmation expected an `ok` of type `boolean`');
    }
    if (errorMsg && typeof errorMsg !== 'string') {
      throw new Error('sendConfirmation expected an optional `errorMsg` of type `string`');
    }
    const customRequest = {
      id: 1,
      jsonrpc: '2.0',
      method: MyWalletConnect.METHOD_CONFIRM,
      params: [{ ok, errorMsg }],
    };
    return this.sendCustomRequest(customRequest);
  }

  async signRawBnbTransaction(signDocObj) {
    if (!this.connected) {
      throw new Error('Session currently disconnected');
    }

    const request = this._formatRequest({
      method: 'bnb_sign',
      params: [signDocObj],
    });

    try {
      // Memo: Didn't return anything...
      // return await this._sendCallRequest(request);

      // Memo: Docs mentioned use `sendCustomRequest`. Looks like `bnb_sign` is not support timelock order?
      //REF: https://docs.binance.org/walletconnect.html
      return await this.sendCustomRequest(request);
    } catch (error) {
      throw error;
    }
  }

  // Ref: https://github.com/trustwallet/web-core/blob/master/packages/walletconnect/src/index.ts#L30
  async trustSignTransaction(signDocObj) {
    if (!this.connected) {
      throw new Error('Session currently disconnected');
    }

    const request = this._formatRequest({
      method: 'trust_signTransaction',
      params: [
        {
          network: NETWORK_ID,
          transaction: JSON.stringify(signDocObj.toJSON()),
        },
      ],
    });
    try {
      return await this._sendCallRequest(request);
    } catch (error) {
      throw error;
    }
  }
}
