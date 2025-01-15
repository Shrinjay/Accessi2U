import { Item, ItemStorageLayer } from 'database';
import { prisma } from '../../config/prisma.js';

export const upsert = async ({ externalId, storage = ItemStorageLayer.TYPESENSE }: Partial<Item>) => {
  return await prisma.item.upsert({
    where: { externalId },
    create: {
      externalId: externalId as string,
      storage,
    },
    update: {},
  });
};
