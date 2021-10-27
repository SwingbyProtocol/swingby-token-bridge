export const logLevel =
  process.env.NEXT_PUBLIC_LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'debug' : 'trace');

export const blocknativeApiKey = process.env.NEXT_PUBLIC_BLOCKNATIVE_KEY || undefined;
export const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_KEY || undefined;

export const isTransactionHistoryEnabled = process.env.NEXT_PUBLIC_ENABLE_TX_HISTORY === 'true';
export const walletConnectBridge = process.env.NEXT_PUBLIC_WALLET_CONNECT_BRIDGE;
