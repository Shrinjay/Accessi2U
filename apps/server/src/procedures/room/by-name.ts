import { Room } from 'database';
import { prisma } from '../../config/prisma.js';

export const roomByName = async (name: string): Promise<Room> => {
  return await prisma.room.findFirstOrThrow({
    where: {
        name: name,
    },
  });
};
