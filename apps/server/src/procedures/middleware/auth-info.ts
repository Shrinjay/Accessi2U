import { prisma } from '../../config/prisma.js';
import { middleware } from '../../trpc.js';

export const authInfoMiddleware = middleware(async ({ next, ctx }) => {
  // Get latest user
  let user = {
    id: 1,
  };
  return next({
    ctx: { user },
  });
});
