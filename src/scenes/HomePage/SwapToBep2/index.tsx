import { Big } from 'big.js';

import { useOnboard } from '../../../modules/onboard';

import { StyledDivider } from './styled';

export const SwapToBep2 = ({ amount }: { amount: Big | null }) => {
  const { network } = useOnboard();

  if (network !== 56 && network !== 97) {
    return <></>;
  }

  return (
    <>
      <StyledDivider />
    </>
  );
};
