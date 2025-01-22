import { Collection, Item } from 'database';
import { prisma } from '../../config/prisma.js';

export const removeFromCollection = async (collection: Collection, item: Item) => {
  return await prisma.collectionItem.delete({
    where: {
      collectionId_itemId: {
        itemId: item.id,
        collectionId: collection.id,
      },
    },
  });
};
