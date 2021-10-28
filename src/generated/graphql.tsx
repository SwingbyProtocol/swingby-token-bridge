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

export type CrashRelationWhereInput = {
  every?: Maybe<CrashWhereInput>;
  none?: Maybe<CrashWhereInput>;
  some?: Maybe<CrashWhereInput>;
};

export type CrashWhereInput = {
  AND?: Maybe<Array<Maybe<CrashWhereInput>>>;
  NOT?: Maybe<Array<Maybe<CrashWhereInput>>>;
  OR?: Maybe<Array<Maybe<CrashWhereInput>>>;
  id?: Maybe<IdFilter>;
  reason?: Maybe<PaymentCrashReasonFilter>;
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
  crashes: Array<PaymentCrash>;
  createdAt: Scalars['DateTime'];
  gas: Scalars['Decimal'];
  gasPrice: Scalars['Decimal'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  network: Network;
  payments: Array<Payment>;
  tokenDecimals: Scalars['Int'];
  transactionIndex: Scalars['Int'];
  updatedAt: Scalars['DateTime'];
  value: Scalars['Decimal'];
};


export type DepositCrashesArgs = {
  after?: Maybe<PaymentCrashWhereUniqueInput>;
  before?: Maybe<PaymentCrashWhereUniqueInput>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
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
  crashes?: Maybe<CrashRelationWhereInput>;
  createdAt?: Maybe<DateTimeFilter>;
  gas?: Maybe<DecimalFilter>;
  gasPrice?: Maybe<DecimalFilter>;
  hash?: Maybe<StringFilter>;
  network?: Maybe<NetworkFilter>;
  payments?: Maybe<PaymentRelationWhereInput>;
  tokenDecimals?: Maybe<IntFilter>;
  transactionIndex?: Maybe<IntFilter>;
  updatedAt?: Maybe<DateTimeFilter>;
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

export type IdFilter = {
  equals?: Maybe<Scalars['ID']>;
  gt?: Maybe<Scalars['ID']>;
  gte?: Maybe<Scalars['ID']>;
  in?: Maybe<Array<Maybe<Scalars['ID']>>>;
  lt?: Maybe<Scalars['ID']>;
  lte?: Maybe<Scalars['ID']>;
  not?: Maybe<IdFilter>;
  notIn?: Maybe<Array<Maybe<Scalars['ID']>>>;
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

export type LiquidityProvider = {
  __typename?: 'LiquidityProvider';
  id?: Maybe<Scalars['String']>;
};

export type Message = {
  __typename?: 'Message';
  message: Scalars['String'];
  seed: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  signTerms?: Maybe<Scalars['Boolean']>;
};


export type MutationSignTermsArgs = {
  address: Scalars['String'];
  signature: Scalars['String'];
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
  createdAt: Scalars['DateTime'];
  deposit: Deposit;
  gas?: Maybe<Scalars['Decimal']>;
  gasPrice?: Maybe<Scalars['Decimal']>;
  hash: Scalars['String'];
  id: Scalars['ID'];
  network: Network;
  status: PaymentStatus;
  tokenDecimals?: Maybe<Scalars['Int']>;
  transactionIndex?: Maybe<Scalars['Int']>;
  updatedAt: Scalars['DateTime'];
  value?: Maybe<Scalars['Decimal']>;
};

export type PaymentCrash = {
  __typename?: 'PaymentCrash';
  deposit: Deposit;
  id: Scalars['ID'];
  reason: PaymentCrashReason;
};

export enum PaymentCrashReason {
  FeesHigherThanAmount = 'FEES_HIGHER_THAN_AMOUNT',
  Unknown = 'UNKNOWN'
}

export type PaymentCrashReasonFilter = {
  equals?: Maybe<PaymentCrashReason>;
  in?: Maybe<Array<Maybe<PaymentCrashReason>>>;
  not?: Maybe<PaymentCrashReasonFilter>;
  notIn?: Maybe<Array<Maybe<PaymentCrashReason>>>;
};

export type PaymentCrashWhereUniqueInput = {
  id?: Maybe<Scalars['Int']>;
};

export type PaymentNetworkHashCompoundUniqueInput = {
  hash: Scalars['String'];
  network: Network;
};

export type PaymentRelationWhereInput = {
  every?: Maybe<PaymentWhereInput>;
  none?: Maybe<PaymentWhereInput>;
  some?: Maybe<PaymentWhereInput>;
};

export enum PaymentStatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Pending = 'PENDING'
}

export type PaymentStatusFilter = {
  equals?: Maybe<PaymentStatus>;
  in?: Maybe<Array<Maybe<PaymentStatus>>>;
  not?: Maybe<PaymentStatusFilter>;
  notIn?: Maybe<Array<Maybe<PaymentStatus>>>;
};

export type PaymentWhereInput = {
  AND?: Maybe<Array<Maybe<PaymentWhereInput>>>;
  NOT?: Maybe<Array<Maybe<PaymentWhereInput>>>;
  OR?: Maybe<Array<Maybe<PaymentWhereInput>>>;
  addressContract?: Maybe<StringFilter>;
  addressFrom?: Maybe<StringFilter>;
  addressTo?: Maybe<StringFilter>;
  at?: Maybe<DateTimeFilter>;
  blockNumber?: Maybe<DecimalFilter>;
  createdAt?: Maybe<DateTimeFilter>;
  gas?: Maybe<DecimalFilter>;
  gasPrice?: Maybe<DecimalFilter>;
  hash?: Maybe<StringFilter>;
  network?: Maybe<NetworkFilter>;
  status?: Maybe<PaymentStatusFilter>;
  tokenDecimals?: Maybe<IntFilter>;
  transactionIndex?: Maybe<IntFilter>;
  updatedAt?: Maybe<DateTimeFilter>;
  value?: Maybe<DecimalFilter>;
};

export type PaymentWhereUniqueInput = {
  network_hash?: Maybe<PaymentNetworkHashCompoundUniqueInput>;
};

export type Query = {
  __typename?: 'Query';
  bridgeBalance: Scalars['Decimal'];
  deposits: DepositsConnection;
  hasSignedTerms?: Maybe<Scalars['Boolean']>;
  liquidityProviders: Array<LiquidityProvider>;
  sanityCheck: Scalars['Boolean'];
  termsMessage: Message;
  tokenCirculatingSupply: Scalars['Decimal'];
  tokenMaxSupply: Scalars['Decimal'];
};


export type QueryBridgeBalanceArgs = {
  network: Network;
};


export type QueryDepositsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  where?: Maybe<DepositWhereInput>;
};


export type QueryHasSignedTermsArgs = {
  address: Scalars['String'];
};


export type QuerySanityCheckArgs = {
  network: Network;
};


export type QueryTokenCirculatingSupplyArgs = {
  network: Network;
};


export type QueryTokenMaxSupplyArgs = {
  network: Network;
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

export type SupplyQueryVariables = Exact<{ [key: string]: never; }>;


export type SupplyQuery = (
  { __typename?: 'Query' }
  & { ethereumSupply: Query['tokenCirculatingSupply'], bscSupply: Query['tokenCirculatingSupply'], ethereumBalance: Query['bridgeBalance'], bscBalance: Query['bridgeBalance'] }
);

export type TermsMessageQueryVariables = Exact<{ [key: string]: never; }>;


export type TermsMessageQuery = (
  { __typename?: 'Query' }
  & { termsMessage: (
    { __typename?: 'Message' }
    & Pick<Message, 'message' | 'seed'>
  ) }
);

export type HasSignedTermsQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type HasSignedTermsQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'hasSignedTerms'>
);

export type SignTermsMutationVariables = Exact<{
  address: Scalars['String'];
  signature: Scalars['String'];
}>;


export type SignTermsMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'signTerms'>
);

export type DepositsHistoryQueryVariables = Exact<{
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  where?: Maybe<DepositWhereInput>;
}>;


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
        & Pick<Deposit, 'id' | 'at' | 'network' | 'hash' | 'value'>
        & { crashes: Array<(
          { __typename?: 'PaymentCrash' }
          & Pick<PaymentCrash, 'reason'>
        )>, payments: Array<(
          { __typename?: 'Payment' }
          & Pick<Payment, 'id' | 'at' | 'network' | 'hash' | 'status' | 'value' | 'updatedAt'>
        )> }
      ) }
    )>, pageInfo: (
      { __typename?: 'ForwardPaginationPageInfo' }
      & Pick<ForwardPaginationPageInfo, 'startCursor' | 'endCursor' | 'hasNextPage' | 'hasPreviousPage'>
    ) }
  ) }
);

export type SanityCheckQueryVariables = Exact<{
  network: Network;
}>;


export type SanityCheckQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'sanityCheck'>
);


export const SupplyDocument = gql`
    query Supply {
  ethereumSupply: tokenCirculatingSupply(network: ETHEREUM)
  bscSupply: tokenCirculatingSupply(network: BSC)
  ethereumBalance: bridgeBalance(network: ETHEREUM)
  bscBalance: bridgeBalance(network: BSC)
}
    `;

/**
 * __useSupplyQuery__
 *
 * To run a query within a React component, call `useSupplyQuery` and pass it any options that fit your needs.
 * When your component renders, `useSupplyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSupplyQuery({
 *   variables: {
 *   },
 * });
 */
export function useSupplyQuery(baseOptions?: Apollo.QueryHookOptions<SupplyQuery, SupplyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SupplyQuery, SupplyQueryVariables>(SupplyDocument, options);
      }
export function useSupplyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SupplyQuery, SupplyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SupplyQuery, SupplyQueryVariables>(SupplyDocument, options);
        }
export type SupplyQueryHookResult = ReturnType<typeof useSupplyQuery>;
export type SupplyLazyQueryHookResult = ReturnType<typeof useSupplyLazyQuery>;
export type SupplyQueryResult = Apollo.QueryResult<SupplyQuery, SupplyQueryVariables>;
export const TermsMessageDocument = gql`
    query TermsMessage {
  termsMessage {
    message
    seed
  }
}
    `;

/**
 * __useTermsMessageQuery__
 *
 * To run a query within a React component, call `useTermsMessageQuery` and pass it any options that fit your needs.
 * When your component renders, `useTermsMessageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTermsMessageQuery({
 *   variables: {
 *   },
 * });
 */
export function useTermsMessageQuery(baseOptions?: Apollo.QueryHookOptions<TermsMessageQuery, TermsMessageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TermsMessageQuery, TermsMessageQueryVariables>(TermsMessageDocument, options);
      }
export function useTermsMessageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TermsMessageQuery, TermsMessageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TermsMessageQuery, TermsMessageQueryVariables>(TermsMessageDocument, options);
        }
export type TermsMessageQueryHookResult = ReturnType<typeof useTermsMessageQuery>;
export type TermsMessageLazyQueryHookResult = ReturnType<typeof useTermsMessageLazyQuery>;
export type TermsMessageQueryResult = Apollo.QueryResult<TermsMessageQuery, TermsMessageQueryVariables>;
export const HasSignedTermsDocument = gql`
    query HasSignedTerms($address: String!) {
  hasSignedTerms(address: $address)
}
    `;

/**
 * __useHasSignedTermsQuery__
 *
 * To run a query within a React component, call `useHasSignedTermsQuery` and pass it any options that fit your needs.
 * When your component renders, `useHasSignedTermsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHasSignedTermsQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useHasSignedTermsQuery(baseOptions: Apollo.QueryHookOptions<HasSignedTermsQuery, HasSignedTermsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HasSignedTermsQuery, HasSignedTermsQueryVariables>(HasSignedTermsDocument, options);
      }
export function useHasSignedTermsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HasSignedTermsQuery, HasSignedTermsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HasSignedTermsQuery, HasSignedTermsQueryVariables>(HasSignedTermsDocument, options);
        }
export type HasSignedTermsQueryHookResult = ReturnType<typeof useHasSignedTermsQuery>;
export type HasSignedTermsLazyQueryHookResult = ReturnType<typeof useHasSignedTermsLazyQuery>;
export type HasSignedTermsQueryResult = Apollo.QueryResult<HasSignedTermsQuery, HasSignedTermsQueryVariables>;
export const SignTermsDocument = gql`
    mutation SignTerms($address: String!, $signature: String!) {
  signTerms(address: $address, signature: $signature)
}
    `;
export type SignTermsMutationFn = Apollo.MutationFunction<SignTermsMutation, SignTermsMutationVariables>;

/**
 * __useSignTermsMutation__
 *
 * To run a mutation, you first call `useSignTermsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignTermsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signTermsMutation, { data, loading, error }] = useSignTermsMutation({
 *   variables: {
 *      address: // value for 'address'
 *      signature: // value for 'signature'
 *   },
 * });
 */
export function useSignTermsMutation(baseOptions?: Apollo.MutationHookOptions<SignTermsMutation, SignTermsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignTermsMutation, SignTermsMutationVariables>(SignTermsDocument, options);
      }
export type SignTermsMutationHookResult = ReturnType<typeof useSignTermsMutation>;
export type SignTermsMutationResult = Apollo.MutationResult<SignTermsMutation>;
export type SignTermsMutationOptions = Apollo.BaseMutationOptions<SignTermsMutation, SignTermsMutationVariables>;
export const DepositsHistoryDocument = gql`
    query DepositsHistory($first: Int, $after: String, $last: Int, $before: String, $where: DepositWhereInput) {
  deposits(
    first: $first
    after: $after
    last: $last
    before: $before
    where: $where
  ) {
    totalCount
    edges {
      cursor
      node {
        id
        at
        network
        hash
        value
        crashes {
          reason
        }
        payments {
          id
          at
          network
          hash
          status
          value
          updatedAt
        }
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
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
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *      where: // value for 'where'
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
export const SanityCheckDocument = gql`
    query SanityCheck($network: Network!) {
  sanityCheck(network: $network)
}
    `;

/**
 * __useSanityCheckQuery__
 *
 * To run a query within a React component, call `useSanityCheckQuery` and pass it any options that fit your needs.
 * When your component renders, `useSanityCheckQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSanityCheckQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useSanityCheckQuery(baseOptions: Apollo.QueryHookOptions<SanityCheckQuery, SanityCheckQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SanityCheckQuery, SanityCheckQueryVariables>(SanityCheckDocument, options);
      }
export function useSanityCheckLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SanityCheckQuery, SanityCheckQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SanityCheckQuery, SanityCheckQueryVariables>(SanityCheckDocument, options);
        }
export type SanityCheckQueryHookResult = ReturnType<typeof useSanityCheckQuery>;
export type SanityCheckLazyQueryHookResult = ReturnType<typeof useSanityCheckLazyQuery>;
export type SanityCheckQueryResult = Apollo.QueryResult<SanityCheckQuery, SanityCheckQueryVariables>;