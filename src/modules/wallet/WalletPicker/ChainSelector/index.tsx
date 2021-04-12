import { FormattedMessage } from 'react-intl';

import { OptionItem } from '../OptionItem';

import { OptionsContainer, Subtitle } from './styled';

type Props = { onSelection: (chain: 'ethereum' | 'binance-chain') => void };

export const ChainSelector = ({ onSelection }: Props) => {
  return (
    <>
      <Subtitle>
        <FormattedMessage id="use-wallet.select-chain.subtitle" />
      </Subtitle>
      <OptionsContainer>
        <OptionItem
          onClick={() => onSelection('ethereum')}
          label={<FormattedMessage id="use-wallet.select-chain.ethereum" />}
        />
        <OptionItem
          onClick={() => onSelection('binance-chain')}
          label={<FormattedMessage id="use-wallet.select-chain.binance-chain" />}
        />
      </OptionsContainer>
    </>
  );
};
