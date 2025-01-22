import { prisma } from '../../config/prisma.js';
import { middleware } from '../../trpc.js';

export const authInfoMiddleware = middleware(async ({ next, ctx }) => {
  // Get latest user
  let user;
  if (ctx?.user?.id) user = await prisma.user.findUnique({ where: { id: ctx.user.id } });

  return next({
    ctx: { user },
  });
});
