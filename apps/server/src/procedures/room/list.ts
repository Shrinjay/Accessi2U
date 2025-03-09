import { sortByIDList } from '../../lib/util.js';
import { prisma } from '../../config/prisma.js';
import { procedure } from '../procedure.js';
import * as Yup from 'yup';

const input = Yup.object({
  buildingId: Yup.number().optional(),
  floorId: Yup.number().optional(),
  roomIds: Yup.array().of(Yup.number()).optional(),
});

export const listRooms = procedure.input(input).query(async ({ ctx, input }) => {
  const { roomIds, buildingId, floorId } = input;

  const rooms = await prisma.room.findMany({
    where: {
      ...(roomIds && { id: { in: roomIds } }),
      ...(buildingId && { building_id: buildingId }),
      ...(floorId && { floor_id: floorId }),
    },
    include: {
      floor: true,
    },
  });

  if (roomIds) {
    return sortByIDList(rooms, roomIds);
  }

  return rooms;
});
