import { TRPCError } from '@trpc/server';

import { Context } from '../../context.js';
// import { _user } from '../../services/user/index.js';
import { ApplicationError } from '../../errors/application-error.js';

const getTrpcErrorCodeFromStatus = (status: number) => {
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 400) return 'BAD_REQUEST';
  return 'INTERNAL_SERVER_ERROR';
};

export const handleError = async (
  err: ApplicationError | any,
  ctx: Context,
  procedure: string,
  additional?: { [key: string]: any },
) => {
  console.error(err);

  const status = err.status || 500;

  const message = err?.meta?.cause ?? err?.message ?? 'Something went wrong';

  throw new TRPCError({ code: getTrpcErrorCodeFromStatus(status), message, cause: err });
};
