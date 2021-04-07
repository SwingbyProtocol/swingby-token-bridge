import { StyledShortAddress } from './styled';

const WIDTH = 5;

export const ShortAddress = ({ value }: { value: string | null | undefined }) => {
  return (
    <StyledShortAddress>
      {value ? `${value.slice(0, WIDTH)}…${value.slice(-WIDTH)}` : null}
    </StyledShortAddress>
  );
};
