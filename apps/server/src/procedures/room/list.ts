import { prisma } from '../../config/prisma.js';
import { procedure } from '../procedure.js';

export const listRooms = procedure.query(async ({ ctx }) => {
  const rooms = await prisma.room.findMany();
  return rooms;
});
