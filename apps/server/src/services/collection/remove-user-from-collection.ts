import { Collection, User } from 'database';
import { prisma } from '../../config/prisma.js';

export const removeUserFromCollection = async (collection: Collection, user: User) => {
  return await prisma.collectionUser.delete({
    where: {
      userId_collectionId: {
        userId: user.id,
        collectionId: collection.id,
      },
    },
  });
};
