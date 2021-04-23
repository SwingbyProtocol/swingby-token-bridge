export const logLevel =
  process.env.NEXT_PUBLIC_LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'debug' : 'trace');

export const server__processTaskSecret = process.env.PROCESS_TASK_SECRET || undefined;
export const server__ethereumWalletPrivateKey = process.env.ETH_BSC_WALLET_KEY || '';
export const server__infuraProjectId = process.env.INFURA_PROJECT_ID || undefined;
export const server__infuraProjectSecret = process.env.INFURA_PROJECT_SECRET || undefined;

export const blocknativeApiKey = process.env.NEXT_PUBLIC_BLOCKNATIVE_KEY || undefined;
export const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_KEY || undefined;

export const isTransactionHistoryEnabled = process.env.NEXT_PUBLIC_ENABLE_TX_HISTORY === 'true';
