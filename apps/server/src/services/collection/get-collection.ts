import { Collection, User } from 'database';
import { prisma } from '../../config/prisma.js';
import { _collection } from './index.js';

export const getCollection = async ({ id }: Partial<Collection>, user: User) => {
  const collection = await prisma.collection.findUnique({
    where: {
      id,
      // Ensures people cannot access collections they do not have access to
      users: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      items: {
        include: {
          item: true,
        },
      },
    },
  });

  return await _collection.decorateCollection(collection);
};
