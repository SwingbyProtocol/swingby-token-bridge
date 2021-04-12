export const logLevel =
  process.env.NEXT_PUBLIC_LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'debug' : 'trace');

export const server__processTaskSecret = process.env.PROCESS_TASK_SECRET || undefined;

export const server__ethereumWalletPrivateKey = process.env.ETHEREUM_WALLET_KEY || '';
export const server__binanceChainWalletPrivateKey = process.env.BINANCE_CHAIN_WALLET_KEY || '';

export const blocknativeApiKey = process.env.NEXT_PUBLIC_BLOCKNATIVE_KEY || undefined;
export const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_KEY || undefined;
