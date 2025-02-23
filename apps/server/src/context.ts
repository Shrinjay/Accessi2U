import * as trpc from '@trpc/server';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';

import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from 'database';
import { supabase } from './config/supabase.js';
import { prisma } from './config/prisma.js';

type ContextOptions = CreateExpressContextOptions | CreateWSSContextFnOptions;

type ContextResult = {
  jwt?: string;
  supabaseUser?: SupabaseUser;
  user?: User | null;
};

const getJwt = (opts: ContextOptions): string | undefined => {
  const connectionParams = (opts as any).info.connectionParams;
  const jwtFromConnectionParams = connectionParams?.token;

  if (jwtFromConnectionParams) return jwtFromConnectionParams;

  const req = opts.req;

  const jwtFromHeader = req?.headers?.authorization?.split(' ')?.[1];
  if (jwtFromHeader) return jwtFromHeader;

  const jwtFromQueryParam = new URLSearchParams(req?.url?.substring(2))?.get('jwt');
  if (jwtFromQueryParam) return jwtFromQueryParam;

  return;
};

export const createContext = async (opts: ContextOptions): Promise<ContextResult> => {
  // Potentially we have a JWT in the request headers
  const jwt = getJwt(opts);
  // If not, we can't authenticate the user
  if (!jwt) return { jwt: undefined, user: undefined };

  // If we do have a JWT, find the Supabase User
  const { data, error } = await supabase.auth.getUser(jwt);
  const supabaseUser = data?.user;

  if (!!error || !supabaseUser?.id) {
    return { jwt: undefined, user: undefined };
  }

  // Find the user in our database + their associated accounts
  const user = await prisma.user.findUnique({
    where: { supabaseUserId: supabaseUser.id },
  });

  return { jwt, user, supabaseUser };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
