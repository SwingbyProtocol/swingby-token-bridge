import { StyledShortAddress } from './styled';

const WIDTH_DEFAULT = 5;

export const ShortAddress = ({
  value,
  width = WIDTH_DEFAULT,
}: {
  value: string | null | undefined;
  width?: number;
}) => {
  return (
    <StyledShortAddress>
      {(() => {
        if (!value) return null;
        if (value.length <= width * 2) return value;
        return `${value.slice(0, width)}…${value.slice(-width)}`;
      })()}
    </StyledShortAddress>
  );
};
