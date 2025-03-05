import { sortByIDList } from '../../lib/util.js';
import { prisma } from '../../config/prisma.js';
import { procedure } from '../procedure.js';
import * as Yup from 'yup';

const input = Yup.object({
  roomIds: Yup.array().of(Yup.number()).optional(),
});

export const listRooms = procedure.input(input).query(async ({ ctx, input }) => {
  const { roomIds } = input;

  const rooms = await prisma.room.findMany({
    where: {
      ...(roomIds && { id: { in: roomIds } }),
    },
  });

  if (roomIds) {
    return sortByIDList(rooms, roomIds);
  }

  return rooms;
});
