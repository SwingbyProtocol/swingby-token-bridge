export type WalletApi = {
  walletSelect: () => Promise<boolean>;
  walletCheck: () => Promise<boolean>;
  walletReset: () => void;
  sign: () => void;
};
