import { ApolloServer } from 'apollo-server-micro';
import { NextApiRequest, NextApiResponse } from 'next';

import { corsMiddleware } from '../../../modules/server__cors';
import { prisma } from '../../../modules/server__env';
import { schema } from '../../../modules/model';

const endpoint = '/api/v1/graphql';

const stuckDeposits = `
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
`;

const server = new ApolloServer({
  schema,
  playground: {
    tabs: [
      {
        name: 'Stuck deposits',
        endpoint,
        query: stuckDeposits,
      },
    ],
  },
  introspection: true,
  context: {
    prisma,
  },
});

const handler = server.createHandler({ path: endpoint });
export default async function (req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware({ req, res });
  return handler(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
