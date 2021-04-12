export const NETWORK_IDS = [
  '1',
  '5',
  '56',
  '97',
  'Binance-Chain-Tigris',
  'Binance-Chain-Ganges',
] as const;
export type NetworkId = typeof NETWORK_IDS[number];

export const isValidNetworkId = (value: any): value is NetworkId =>
  !!NETWORK_IDS.find((it) => `${it}` === `${value}`);
