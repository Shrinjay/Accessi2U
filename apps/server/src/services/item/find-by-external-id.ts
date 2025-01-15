import { Item } from 'database';
import { prisma } from '../../config/prisma.js';

export const findByExternalId = async (externalId: string): Promise<Item> => {
  return await prisma.item.findUnique({ where: { externalId } });
};
