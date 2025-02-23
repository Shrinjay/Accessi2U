import { Node, Room } from 'database';
import { prisma } from '../../config/prisma.js';

export const node = async (room: Room): Promise<Node> => {
  return await prisma.node.findFirstOrThrow({
    where: {
      room_id: room.id,
    },
  });
};
