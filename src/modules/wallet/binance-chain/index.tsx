import WalletConnectClient from '@walletconnect/client';
import { useEffect, useMemo, useState } from 'react';

import { logger } from '../../logger';

const WALLET_CONNECT_BINANCE_CHAIN_ID = 714; // Binance-Chain-Tigris

const buildNewInstance = () =>
  new WalletConnectClient({ bridge: 'https://bridge.walletconnect.org' });

export const useWalletConnect = () => {
  const [instance, setInstance] = useState(buildNewInstance());
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    instance.on('connect', (err, payload) => {
      logger.debug({ err, payload }, 'WalletConnect event: "connect"');
      if (err) throw err;

      instance
        .sendCustomRequest({
          id: 1,
          jsonrpc: '2.0',
          method: 'get_accounts',
          params: [],
        })
        .then((accounts: Array<{ address: string; network: number }>) => {
          logger.debug({ accounts }, 'WalletConnect: Got list of accounts');
          const account = accounts.find(
            ({ network }) => network === WALLET_CONNECT_BINANCE_CHAIN_ID,
          );
          if (!account) {
            throw new Error(`Could not find any Binance Chain account`);
          }

          setAddress(account.address);
        });
    });

    instance.on('disconnect', (err, payload) => {
      logger.debug({ err, payload }, 'WalletConnect event: "disconnect"');
      setAddress(null);
      setInstance(buildNewInstance());
    });

    instance.on('session_request', (err, payload) => {
      logger.debug({ err, payload }, 'WalletConnect event: "session_request"');
      if (err) throw err;
    });

    instance.on('session_update', (err, payload) => {
      logger.debug({ err, payload }, 'WalletConnect event: "session_update"');
      if (err) throw err;
    });

    instance.on('call_request', (err, payload) => {
      logger.debug({ err, payload }, 'WalletConnect event: "call_request"');
      if (err) throw err;
    });

    instance.on('wc_sessionRequest', (err, payload) => {
      logger.debug({ err, payload }, 'WalletConnect event: "wc_sessionRequest"');
      if (err) throw err;
    });

    instance.on('wc_sessionUpdate', (err, payload) => {
      logger.debug({ err, payload }, 'WalletConnect event: "wc_sessionUpdate"');
      if (err) throw err;
    });
  }, [instance]);

  return useMemo(() => ({ instance, address }), [instance, address]);
};

class MyWalletConnect extends WalletConnectClient {
  static METHOD_SIGN = 'bnb_sign';
  static METHOD_CONFIRM = 'bnb_tx_confirmation';

  async sendTransaction(signDocObj) {
    if (!signDocObj || typeof signDocObj !== 'object') {
      throw new Error('sendTransaction expected a `signDocObj` of type `object`');
    }

    return this.sendCustomRequest({
      id: 1,
      jsonrpc: '2.0',
      method: MyWalletConnect.METHOD_SIGN,
      params: [signDocObj],
    });
  }

  async sendConfirmation(ok = true, errorMsg = null) {
    if (typeof ok !== 'boolean') {
      throw new Error('sendConfirmation expected an `ok` of type `boolean`');
    }

    if (errorMsg && typeof errorMsg !== 'string') {
      throw new Error('sendConfirmation expected an optional `errorMsg` of type `string`');
    }

    return this.sendCustomRequest({
      id: 1,
      jsonrpc: '2.0',
      method: MyWalletConnect.METHOD_CONFIRM,
      params: [{ ok, errorMsg }],
    });
  }

  async signRawBnbTransaction(signDocObj) {
    if (!this.connected) {
      throw new Error('Session currently disconnected');
    }

    return await this.sendCustomRequest({
      id: 1,
      jsonrpc: '2.0',
      method: MyWalletConnect.METHOD_SIGN,
      params: [signDocObj],
    });
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
          network: WALLET_CONNECT_BINANCE_CHAIN_ID,
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
