import { createTRPCReact } from '@trpc/react-query'

import type { TrpcRouter } from 'server';

export const trpc = createTRPCReact<TrpcRouter>()
