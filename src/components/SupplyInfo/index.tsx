import { FormattedNumber } from 'react-intl';

import { StyledCard, ItemAmount, StyledNetworkTag } from './styled';

export const SupplyInfo = ({ className }: { className?: string }) => {
  return (
    <StyledCard size="town" className={className}>
      <StyledNetworkTag network={1} />
      <ItemAmount>
        <FormattedNumber value={124897172401240} maximumFractionDigits={0} />
      </ItemAmount>
      <StyledNetworkTag network={56} />
      <ItemAmount>
        <FormattedNumber value={124897172401240} maximumFractionDigits={0} />
      </ItemAmount>
      <StyledNetworkTag network="bridge" />
      <ItemAmount>
        <FormattedNumber value={124897172401240} maximumFractionDigits={0} />
      </ItemAmount>
    </StyledCard>
  );
};
