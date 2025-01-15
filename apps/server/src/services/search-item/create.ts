import { SearchItem } from 'database';
import { prisma } from '../../config/prisma.js';

export const create = async ({ searchId, itemId }: Partial<SearchItem>) => {
  return await prisma.searchItem.create({
    data: { searchId, itemId },
  });
};
