import { trpc } from '../trpc.js';

import * as authProcedures from './auth/index.js';

export const router = trpc.router({
  ...authProcedures,
});

export type Router = typeof router;
