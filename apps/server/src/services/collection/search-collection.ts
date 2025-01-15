import { Collection } from 'database';
import { prisma } from '../../config/prisma.js';
import { _collection } from './index.js';

export const searchCollection = async ({ name }: Partial<Collection>) => {
  const collections = await prisma.collection.findMany({
    where: {
      name: {
        contains: `%${name}%`,
        mode: 'insensitive',
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

  return await Promise.all(collections.map(_collection.decorateCollection));
};
