import { Collection, User } from 'database';
import { prisma } from '../../config/prisma.js';

export const addUserToCollection = async (collection: Collection, user: User) => {
  return await prisma.collectionUser.create({
    data: {
      collectionId: collection.id,
      userId: user.id,
    },
  });
};
