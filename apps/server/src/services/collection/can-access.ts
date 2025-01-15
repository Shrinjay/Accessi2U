import { Collection, User } from 'database';
import { prisma } from '../../config/prisma.js';

export const canAccess = async (collection: Collection, user: User) => {
  const grant = await prisma.collectionUser.findUnique({
    where: { userId_collectionId: { userId: user.id, collectionId: collection.id } },
  });

  const hasAccess = !!grant;

  return hasAccess;
};
