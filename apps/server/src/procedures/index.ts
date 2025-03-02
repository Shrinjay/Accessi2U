import { trpc } from '../trpc.js';

import * as renderProcedures from './render/index.js';
import * as routeProcedures from './route/index.js';
import * as roomProcedures from './room/index.js';
import * as floorProcedures from './floors/index.js';
import * as buildingProcedures from './building/index.js';

export const router = trpc.router({
  ...renderProcedures,
  ...routeProcedures,
  ...roomProcedures,
  ...floorProcedures,
  ...buildingProcedures,
});

export type Router = typeof router;
