import { trpc } from '../trpc.js';

import * as collectionProcedures from './collection/index.js';
import * as searchProcedures from './search/index.js';
import * as authProcedures from './auth/index.js';
import * as userProcedures from './user/index.js';

export const router = trpc.router({
  ...collectionProcedures,
  ...searchProcedures,
  ...authProcedures,
  ...userProcedures,
});

export type Router = typeof router;
