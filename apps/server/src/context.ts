import * as trpc from '@trpc/server';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';

import { User as SupabaseUser } from '@supabase/supabase-js';

type ContextOptions = CreateExpressContextOptions | CreateWSSContextFnOptions;

type ContextResult = {};

export const createContext = async (opts: ContextOptions): Promise<ContextResult> => {
  return {};
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
