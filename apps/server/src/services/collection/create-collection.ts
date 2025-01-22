import { Collection } from 'database';
import { prisma } from '../../config/prisma.js';

type CreateCollectionParams = Pick<Collection, 'name'>;

export const createCollection = async ({ name }: CreateCollectionParams) => {
  return await prisma.collection.create({
    data: {
      name,
    },
  });
};
