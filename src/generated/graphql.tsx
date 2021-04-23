import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A timestamp. */
  DateTime: string;
  /** A number without precision limits. */
  Decimal: string;
};


export type DateTimeFilter = {
  equals?: Maybe<Scalars['DateTime']>;
  gt?: Maybe<Scalars['DateTime']>;
  gte?: Maybe<Scalars['DateTime']>;
  in?: Maybe<Array<Maybe<Scalars['DateTime']>>>;
  lt?: Maybe<Scalars['DateTime']>;
  lte?: Maybe<Scalars['DateTime']>;
  not?: Maybe<DateTimeFilter>;
  notIn?: Maybe<Array<Maybe<Scalars['DateTime']>>>;
};


export type DecimalFilter = {
  equals?: Maybe<Scalars['Decimal']>;
  gt?: Maybe<Scalars['Decimal']>;
  gte?: Maybe<Scalars['Decimal']>;
  in?: Maybe<Array<Maybe<Scalars['Decimal']>>>;
  lt?: Maybe<Scalars['Decimal']>;
  lte?: Maybe<Scalars['Decimal']>;
  not?: Maybe<DecimalFilter>;
  notIn?: Maybe<Array<Maybe<Scalars['Decimal']>>>;
};

export type Deposit = {
  __typename?: 'Deposit';
  addressContract: Scalars['String'];
  addressFrom: Scalars['String'];
  addressTo: Scalars['String'];
  at: Scalars['DateTime'];
  blockNumber: Scalars['Decimal'];
  gas: Scalars['Decimal'];
  gasPrice: Scalars['Decimal'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  network: Network;
  payments: Array<Payment>;
  tokenDecimals: Scalars['Int'];
  transactionIndex: Scalars['Int'];
  value: Scalars['Decimal'];
};


export type DepositPaymentsArgs = {
  after?: Maybe<PaymentWhereUniqueInput>;
  before?: Maybe<PaymentWhereUniqueInput>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type DepositWhereInput = {
  AND?: Maybe<Array<Maybe<DepositWhereInput>>>;
  NOT?: Maybe<Array<Maybe<DepositWhereInput>>>;
  OR?: Maybe<Array<Maybe<DepositWhereInput>>>;
  addressContract?: Maybe<StringFilter>;
  addressFrom?: Maybe<StringFilter>;
  addressTo?: Maybe<StringFilter>;
  at?: Maybe<DateTimeFilter>;
  blockNumber?: Maybe<DecimalFilter>;
  gas?: Maybe<DecimalFilter>;
  gasPrice?: Maybe<DecimalFilter>;
  hash?: Maybe<StringFilter>;
  network?: Maybe<NetworkFilter>;
  tokenDecimals?: Maybe<IntFilter>;
  transactionIndex?: Maybe<IntFilter>;
  value?: Maybe<DecimalFilter>;
};

export type DepositsConnection = {
  __typename?: 'DepositsConnection';
  edges: Array<DepositsConnectionEdges>;
  pageInfo: ForwardPaginationPageInfo;
  totalCount: Scalars['Int'];
};

export type DepositsConnectionEdges = {
  __typename?: 'DepositsConnectionEdges';
  cursor: Scalars['String'];
  node: Deposit;
};

export type ForwardPaginationPageInfo = {
  __typename?: 'ForwardPaginationPageInfo';
  endCursor: Scalars['String'];
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor: Scalars['String'];
};

export type IntFilter = {
  equals?: Maybe<Scalars['Int']>;
  gt?: Maybe<Scalars['Int']>;
  gte?: Maybe<Scalars['Int']>;
  in?: Maybe<Array<Maybe<Scalars['Int']>>>;
  lt?: Maybe<Scalars['Int']>;
  lte?: Maybe<Scalars['Int']>;
  not?: Maybe<IntFilter>;
  notIn?: Maybe<Array<Maybe<Scalars['Int']>>>;
};

export enum Network {
  Bsc = 'BSC',
  Bsct = 'BSCT',
  Ethereum = 'ETHEREUM',
  Goerli = 'GOERLI'
}

export type NetworkFilter = {
  equals?: Maybe<Network>;
  in?: Maybe<Array<Maybe<Network>>>;
  not?: Maybe<NetworkFilter>;
  notIn?: Maybe<Array<Maybe<Network>>>;
};

export type Payment = {
  __typename?: 'Payment';
  addressContract?: Maybe<Scalars['String']>;
  addressFrom?: Maybe<Scalars['String']>;
  addressTo?: Maybe<Scalars['String']>;
  at?: Maybe<Scalars['DateTime']>;
  blockNumber?: Maybe<Scalars['Decimal']>;
  deposit: Deposit;
  gas?: Maybe<Scalars['Decimal']>;
  gasPrice?: Maybe<Scalars['Decimal']>;
  hash: Scalars['String'];
  id: Scalars['ID'];
  network: Network;
  status: PaymentStatus;
  tokenDecimals?: Maybe<Scalars['Int']>;
  transactionIndex?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['Decimal']>;
};

export type PaymentNetworkHashCompoundUniqueInput = {
  hash: Scalars['String'];
  network: Network;
};

export enum PaymentStatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Pending = 'PENDING'
}

export type PaymentWhereUniqueInput = {
  network_hash?: Maybe<PaymentNetworkHashCompoundUniqueInput>;
};

export type Query = {
  __typename?: 'Query';
  deposits: DepositsConnection;
};


export type QueryDepositsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  where?: Maybe<DepositWhereInput>;
};

export type StringFilter = {
  contains?: Maybe<Scalars['String']>;
  endsWith?: Maybe<Scalars['String']>;
  equals?: Maybe<Scalars['String']>;
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  mode?: Maybe<StringFilterMode>;
  not?: Maybe<StringFilter>;
  notIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  startsWith?: Maybe<Scalars['String']>;
};

export enum StringFilterMode {
  Default = 'default',
  Insensitive = 'insensitive'
}

export type DepositsHistoryQueryVariables = Exact<{ [key: string]: never; }>;


export type DepositsHistoryQuery = (
  { __typename?: 'Query' }
  & { deposits: (
    { __typename?: 'DepositsConnection' }
    & Pick<DepositsConnection, 'totalCount'>
    & { edges: Array<(
      { __typename?: 'DepositsConnectionEdges' }
      & Pick<DepositsConnectionEdges, 'cursor'>
      & { node: (
        { __typename?: 'Deposit' }
        & Pick<Deposit, 'id' | 'at'>
      ) }
    )> }
  ) }
);


export const DepositsHistoryDocument = gql`
    query DepositsHistory {
  deposits {
    totalCount
    edges {
      cursor
      node {
        id
        at
      }
    }
  }
}
    `;

/**
 * __useDepositsHistoryQuery__
 *
 * To run a query within a React component, call `useDepositsHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useDepositsHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDepositsHistoryQuery({
 *   variables: {
 *   },
 * });
 */
export function useDepositsHistoryQuery(baseOptions?: Apollo.QueryHookOptions<DepositsHistoryQuery, DepositsHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DepositsHistoryQuery, DepositsHistoryQueryVariables>(DepositsHistoryDocument, options);
      }
export function useDepositsHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DepositsHistoryQuery, DepositsHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DepositsHistoryQuery, DepositsHistoryQueryVariables>(DepositsHistoryDocument, options);
        }
export type DepositsHistoryQueryHookResult = ReturnType<typeof useDepositsHistoryQuery>;
export type DepositsHistoryLazyQueryHookResult = ReturnType<typeof useDepositsHistoryLazyQuery>;
export type DepositsHistoryQueryResult = Apollo.QueryResult<DepositsHistoryQuery, DepositsHistoryQueryVariables>;