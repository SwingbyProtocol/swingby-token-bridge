import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { ShortAddress } from '../components/ShortAddress';
import { WalletPicker } from '../modules/binance-chain/WalletPicker';
import { logger } from '../modules/logger';
import { useOnboard, isValidNetworkId } from '../modules/web3';

export default function HomePage() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <button onClick={() => setOpen(true)}>Modal</button>
      <WalletPicker open={open} onClose={() => setOpen(false)} />
    </>
  );
}
