import { Collection, Item } from 'database';
import { prisma } from '../../config/prisma.js';

export const addToCollection = async (collection: Collection, item: Item) => {
  return await prisma.collectionItem.create({
    data: {
      collectionId: collection.id,
      itemId: item.id,
    },
  });
};
