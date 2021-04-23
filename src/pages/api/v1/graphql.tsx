import { ApolloServer } from 'apollo-server-micro';
import { NextApiRequest, NextApiResponse } from 'next';

import { corsMiddleware } from '../../../modules/server__cors';
import { prisma } from '../../../modules/server__env';
import { schema } from '../../../modules/model';

const server = new ApolloServer({
  schema,
  playground: true,
  introspection: true,
  context: {
    prisma,
  },
});

const handler = server.createHandler({ path: '/api/v1/graphql' });
export default async function (req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware({ req, res });
  return handler(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
