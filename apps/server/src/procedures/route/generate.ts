import { trpc } from '../../trpc.js';
import { prisma } from '../../config/prisma.js';
import { _room } from '../../services/room/index.js';
import { procedure } from '../procedure.js';
import * as Yup from 'yup';

const input = Yup.object({
  fromRoomId: Yup.number().required(),
  toRoomId: Yup.number().required(),
});

export const generateRoute = trpc.procedure.input(input).mutation(async ({ ctx, input }) => {
  const { fromRoomId, toRoomId } = input;

  const fromRoom = await prisma.room.findUniqueOrThrow({
    where: { id: fromRoomId },
  });
  const toRoom = await prisma.room.findUniqueOrThrow({
    where: { id: toRoomId },
  });

  const path = await _room.pathToRoom(fromRoom, toRoom);

  return path;
});
