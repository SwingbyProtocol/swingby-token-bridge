import { useState } from 'react';

import { WalletPicker } from '../modules/binance-chain';

export default function HomePage() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <button onClick={() => setOpen(true)}>Modal</button>
      <WalletPicker open={open} onClose={() => setOpen(false)} />
    </>
  );
}
