import useSWR from 'swr';
import { FormattedMessage, useIntl } from 'react-intl';
import { stringifyUrl } from 'query-string';
import { getCryptoAssetFormatter, getFiatAssetFormatter } from '@swingby-protocol/pulsar';

import { useOnboard } from '../../../modules/onboard';
import { fetcher } from '../../../modules/fetch';

export const SwapFee = () => {
  const { locale } = useIntl();
  const { address, network } = useOnboard();
  const { data: feeData } = useSWR<{ estimatedFeeUsd: string; estimatedFeeSwingby: string }>(
    stringifyUrl({
      url: `/api/v1/${network}/swap-fee`,
      query: { addressReceiving: address || undefined },
    }),
    fetcher,
    { refreshInterval: 15000 },
  );

  return (
    <FormattedMessage
      id="form.swap-fee"
      values={{
        value: feeData ? (
          <FormattedMessage
            id="form.swap-fee.est-value"
            values={{
              swingby: getCryptoAssetFormatter({
                locale,
                displaySymbol: 'SWINGBY',
                maximumFractionDigits: 2,
              }).format(+feeData.estimatedFeeSwingby),
              usd: getFiatAssetFormatter({ locale, currency: 'USD' }).format(
                +feeData.estimatedFeeUsd,
              ),
            }}
          />
        ) : (
          '?'
        ),
      }}
    />
  );
};
