import { parse, print } from 'graphql';

import { server__graphqlEndpoint } from '../server__env';

import type { Config } from 'apollo-server-micro';

export const playground: Config['playground'] = {
  tabs: [
    {
      name: 'All deposits',
      endpoint: server__graphqlEndpoint,
      query: print(
        parse(`
          {
            deposits(where: { network: { in: [ETHEREUM, BSC] } }) {
              totalCount
              edges {
                node {
                  hash
                  at
                  addressFrom
                  value
                  crashes {
                    reason
                  }
                  payments {
                    hash
                    status
                  }
                }
              }
            }
          }
      `),
      ),
    },
    {
      name: 'Liquidity providers',
      endpoint: server__graphqlEndpoint,
      query: print(
        parse(`
          {
            liquidityProviders {
              id
            }
          }
      `),
      ),
    },
    {
      name: 'Stuck deposits',
      endpoint: server__graphqlEndpoint,
      query: print(
        parse(`
          {
            deposits(
              where: {
                network: { in: [ETHEREUM, BSC] }
                payments: { every: { status: { notIn: [COMPLETED, PENDING] } } }
                crashes: { none: {} }
              }
            ) {
              edges {
                node {
                  hash
                  at
                  addressFrom
                  value
                  crashes {
                    reason
                  }
                  payments {
                    hash
                    status
                  }
                }
              }
            }
          }
      `),
      ),
    },
  ],
};
