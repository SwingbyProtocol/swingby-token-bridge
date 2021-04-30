import { FormattedMessage, FormattedNumber } from 'react-intl';

import { StyledCard, ItemAmount, StyledNetworkTag, Header } from './styled';

export const SupplyInfo = ({ className }: { className?: string }) => {
  return (
    <StyledCard size="town" className={className}>
      <div />
      <Header>
        <FormattedMessage id="supply-info.chain-tag" />
      </Header>
      <Header>
        <FormattedMessage id="supply-info.bridge-tag" />
      </Header>
      <StyledNetworkTag network={1} />
      <ItemAmount>
        <FormattedNumber value={124897172401240} maximumFractionDigits={0} />
      </ItemAmount>
      <ItemAmount>
        <FormattedNumber value={124897172401240} maximumFractionDigits={0} />
      </ItemAmount>
      <StyledNetworkTag network={56} />
      <ItemAmount>
        <FormattedNumber value={124897172401240} maximumFractionDigits={0} />
      </ItemAmount>
      <ItemAmount>
        <FormattedNumber value={124897172401240} maximumFractionDigits={0} />
      </ItemAmount>
    </StyledCard>
  );
};
