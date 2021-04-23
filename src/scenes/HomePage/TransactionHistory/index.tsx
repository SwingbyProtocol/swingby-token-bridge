import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import { useDepositsHistoryQuery, StringFilterMode, Network } from '../../../generated/graphql';
import { useOnboard } from '../../../modules/onboard';

import { Container, Item } from './styled';

const PAGE_SIZE = 25;

export const TransactionHistory = () => {
  const { address, network } = useOnboard();
  if (!address || !network) {
    throw new Error('Not connected to a wallet or valid network');
  }

  const { data, fetchMore } = useDepositsHistoryQuery({
    variables: {
      first: PAGE_SIZE,
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

  const { deposits } = data;
  return (
    <Container size="bare">
      <AutoSizer>
        {({ width, height }) => (
          <InfiniteLoader
            itemCount={deposits.totalCount ?? Infinity}
            isItemLoaded={(index: number) =>
              !!deposits.edges[index] || !deposits.pageInfo.hasNextPage
            }
            loadMoreItems={() =>
              fetchMore({
                variables: {
                  after: deposits.pageInfo.endCursor,
                  first: PAGE_SIZE,
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
              })
            }
          >
            {({ onItemsRendered, ref }) => (
              <List
                initialScrollOffset={0}
                onItemsRendered={onItemsRendered}
                ref={ref}
                height={height}
                width={width}
                itemCount={deposits.edges.length ?? 0}
                itemSize={90}
                itemKey={(index: number) => deposits.edges[index].node.id}
              >
                {({ index, style }) => {
                  const item = deposits.edges[index].node;
                  return (
                    <Item key={item.id} style={style}>
                      {item.at}
                    </Item>
                  );
                }}
              </List>
            )}
          </InfiniteLoader>
        )}
      </AutoSizer>
    </Container>
  );
};
