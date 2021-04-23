import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { FormattedDate } from 'react-intl';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { useTheme } from 'styled-components';

import { ShortAddress } from '../../../components/ShortAddress';
import { useDepositsHistoryQuery, StringFilterMode, Network } from '../../../generated/graphql';
import { useOnboard } from '../../../modules/onboard';

import { Container, Item, ItemDate, ItemHash, ItemHashContainer } from './styled';

const PAGE_SIZE = 25;

export const TransactionHistory = () => {
  const { address, network } = useOnboard();
  if (!address || !network) {
    throw new Error('Not connected to a wallet or valid network');
  }

  const theme = useTheme();
  const where = useMemo(
    () => ({
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
    }),
    [address, network],
  );

  const { data, fetchMore } = useDepositsHistoryQuery({ variables: { first: PAGE_SIZE, where } });
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
                variables: { after: deposits.pageInfo.endCursor, first: PAGE_SIZE, where },
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
                itemSize={theme.pulsar.size.state}
                itemKey={(index: number) => deposits.edges[index].node.id}
              >
                {({ index, style }) => {
                  const item = deposits.edges[index].node;
                  return (
                    <Item key={item.id} style={style} isEven={(index + 1) % 2 === 0}>
                      <ItemHashContainer>
                        <ItemHash>
                          <a
                            href={(() => {
                              switch (item.network) {
                                case Network.Ethereum:
                                  return `https://etherscan.io/tx/${item.hash}`;
                                case Network.Goerli:
                                  return `https://goerli.etherscan.io/tx/${item.hash}`;
                                case Network.Bsc:
                                  return `https://bscscan.com/tx/${item.hash}`;
                                case Network.Bsct:
                                  return `https://testnet.bscscan.com/tx/${item.hash}`;
                              }
                            })()}
                            rel="noreferrer"
                          >
                            <ShortAddress value={item.hash} />
                          </a>
                        </ItemHash>
                        <ItemDate>
                          <FormattedDate
                            value={DateTime.fromISO(item.at).toLocal().toJSDate()}
                            hour12={false}
                            dateStyle="long"
                            timeStyle="medium"
                          />
                        </ItemDate>
                      </ItemHashContainer>
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
