import { trpc } from '../../trpc.js';
import { prisma } from '../../config/prisma.js';
import { _room } from '../../services/room/index.js';
import { procedure } from '../procedure.js';
import * as Yup from 'yup';
import { handleError } from '../middleware/handle-error.js';

const input = Yup.object({
  fromRoomId: Yup.number().required(),
  toRoomId: Yup.number().required(),
  elevatorOnly: Yup.boolean().required(),
});

export const generateRoute = procedure.input(input).mutation(async ({ ctx, input }) => {
  try {
    const { fromRoomId, toRoomId, elevatorOnly } = input;

    const fromRoom = await prisma.room.findUniqueOrThrow({
      where: { id: fromRoomId },
    });
    const toRoom = await prisma.room.findUniqueOrThrow({
      where: { id: toRoomId },
    });

    const path = await _room.pathToRoom(fromRoom, toRoom, { elevatorOnly });

    return path;
  } catch (e) {
    return handleError(e, ctx, 'generateRoute');
  }
});
