import { User } from 'database';
import { prisma } from '../../config/prisma.js';

export const update = async (id: number, data: Partial<User>) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};
