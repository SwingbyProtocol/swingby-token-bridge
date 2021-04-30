import { FormattedMessage, FormattedNumber } from 'react-intl';

import { useSupplyQuery } from '../../generated/graphql';

import { StyledCard, ItemAmount, StyledNetworkTag, Header } from './styled';

const numberFormat: Partial<React.ComponentPropsWithoutRef<typeof FormattedNumber>> = {
  maximumFractionDigits: 0,
};

export const SupplyInfo = ({ className }: { className?: string }) => {
  const { data } = useSupplyQuery({ pollInterval: 60000 });

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
        {!data ? '?' : <FormattedNumber {...numberFormat} value={+(data.ethereumSupply ?? 0)} />}
      </ItemAmount>
      <ItemAmount>
        {!data ? '?' : <FormattedNumber {...numberFormat} value={+(data.ethereumBalance ?? 0)} />}
      </ItemAmount>
      <StyledNetworkTag network={56} />
      <ItemAmount>
        {!data ? '?' : <FormattedNumber {...numberFormat} value={+(data.bscSupply ?? 0)} />}
      </ItemAmount>
      <ItemAmount>
        {!data ? '?' : <FormattedNumber {...numberFormat} value={+(data.bscBalance ?? 0)} />}
      </ItemAmount>
    </StyledCard>
  );
};
