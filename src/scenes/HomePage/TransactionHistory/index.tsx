import { Icon, useMatchMedia } from '@swingby-protocol/pulsar';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { FormattedDate, FormattedNumber } from 'react-intl';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import { ShortAddress } from '../../../components/ShortAddress';
import {
  useDepositsHistoryQuery,
  StringFilterMode,
  Network,
  PaymentStatus,
} from '../../../generated/graphql';
import { useOnboard } from '../../../modules/onboard';

import { buildExplorerLink } from './buildExplorerLink';
import {
  Container,
  Item,
  ItemDate,
  ItemHash,
  ItemHashContainer,
  SideContainer,
  Arrow,
  WIDE_SCREEN,
  AmountContainer,
  Amount,
} from './styled';

const PAGE_SIZE = 25;

export const TransactionHistory = () => {
  const { address, network } = useOnboard();
  if (!address || !network) {
    throw new Error('Not connected to a wallet or valid network');
  }

  const isWideScreen = useMatchMedia({ query: WIDE_SCREEN });
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
                itemSize={isWideScreen ? 74 : 96}
                itemKey={(index: number) => deposits.edges[index].node.id}
              >
                {({ index, style }) => {
                  const item = deposits.edges[index].node;
                  const lastPayment = item.payments[item.payments.length - 1];
                  return (
                    <Item key={item.id} style={style} isEven={(index + 1) % 2 === 0}>
                      <SideContainer>
                        <ItemHashContainer>
                          <ItemHash>
                            <a href={buildExplorerLink(item)} rel="noreferrer">
                              <ShortAddress value={item.hash} />
                            </a>
                          </ItemHash>
                          <ItemDate>
                            <FormattedDate
                              value={DateTime.fromISO(item.at).toLocal().toJSDate()}
                              hour12={false}
                              dateStyle={isWideScreen ? 'long' : 'short'}
                              timeStyle={isWideScreen ? 'medium' : 'short'}
                            />
                          </ItemDate>
                        </ItemHashContainer>
                        <AmountContainer>
                          <Icon.Swingby />
                          &nbsp;
                          <Amount>
                            <FormattedNumber
                              value={+item.value}
                              maximumFractionDigits={2}
                              maximumSignificantDigits={isWideScreen ? 7 : 5}
                            />
                          </Amount>
                        </AmountContainer>
                      </SideContainer>

                      <Arrow
                        status={(() => {
                          switch (lastPayment?.status) {
                            case PaymentStatus.Completed:
                              return 'success';
                            case PaymentStatus.Failed:
                              return 'danger';
                            case PaymentStatus.Pending:
                            default:
                              return 'warning';
                          }
                        })()}
                      >
                        <Icon.ArrowRight />
                      </Arrow>

                      <SideContainer>
                        {!lastPayment ? (
                          <ItemHash>…</ItemHash>
                        ) : (
                          <>
                            <ItemHashContainer>
                              <ItemHash>
                                <a href={buildExplorerLink(lastPayment)} rel="noreferrer">
                                  <ShortAddress value={lastPayment.hash} />
                                </a>
                              </ItemHash>
                              {!!lastPayment.at && (
                                <ItemDate>
                                  <FormattedDate
                                    value={DateTime.fromISO(lastPayment.at).toLocal().toJSDate()}
                                    hour12={false}
                                    dateStyle={isWideScreen ? 'long' : 'short'}
                                    timeStyle={isWideScreen ? 'medium' : 'short'}
                                  />
                                </ItemDate>
                              )}
                            </ItemHashContainer>
                            {!!lastPayment.value && (
                              <AmountContainer>
                                <Icon.Swingby />
                                &nbsp;
                                <Amount>
                                  <FormattedNumber
                                    value={+item.value}
                                    maximumFractionDigits={2}
                                    maximumSignificantDigits={isWideScreen ? 7 : 5}
                                  />
                                </Amount>
                              </AmountContainer>
                            )}
                          </>
                        )}
                      </SideContainer>
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
