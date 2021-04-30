import path from 'path';

import { makeSchema } from 'nexus';
import { nexusPrisma } from 'nexus-plugin-prisma';

import * as scalars from './scalars';
import * as transactions from './transactions';
import * as filters from './filters';
import * as sanityCheck from './sanity-check';
import * as tokenSupply from './supply';

export const schema = makeSchema({
  types: { ...scalars, ...transactions, ...filters, ...sanityCheck, ...tokenSupply },
  plugins: [nexusPrisma()],
  contextType: {
    module: path.join(__dirname, 'context.ts'),
    export: 'MyContextType',
  },
  outputs: {
    typegen: path.join(__dirname, '..', '..', '..', 'nexus-typegen.d.ts'),
    schema: path.join(__dirname, '..', '..', '..', 'schema.graphql'),
  },
});

export default schema;
