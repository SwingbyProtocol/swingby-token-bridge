import { useDepositsHistoryQuery, StringFilterMode, Network } from '../../../generated/graphql';
import { useOnboard } from '../../../modules/onboard';

import { Container } from './styled';

export const TransactionHistory = () => {
  const { address, network } = useOnboard();
  if (!address || !network) {
    throw new Error('Not connected to a wallet or valid network');
  }

  const { data } = useDepositsHistoryQuery({
    variables: {
      where: {
        network: {
          equals: (() => {
            switch (network) {
              case 1:
                return Network.Ethereum;
              case 5:
                return Network.Goerli;
              case 56:
                return Network.Bsc;
              case 97:
                return Network.Bsct;
            }
          })(),
        },
        addressFrom: { equals: address, mode: StringFilterMode.Insensitive },
      },
    },
  });
  if (!data) {
    return <></>;
  }

  return (
    <Container size="bare">
      {data.deposits.edges.map((it) => (
        <div>{JSON.stringify(it)}</div>
      ))}
    </Container>
  );
};
