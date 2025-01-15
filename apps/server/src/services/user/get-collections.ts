import { User } from 'database';
import { prisma } from '../../config/prisma.js';
import { _collection } from '../collection/index.js';

export const getCollections = async (user: User) => {
  const collectionUsers = await prisma.collectionUser.findMany({
    where: { userId: user.id },
    include: {
      collection: {
        include: {
          items: {
            include: {
              item: true,
            },
          },
        },
      },
    },
  });

  const collections = collectionUsers.map((collectionUser) => collectionUser.collection);
  return await Promise.all(collections.map(_collection.decorateCollection));
};
