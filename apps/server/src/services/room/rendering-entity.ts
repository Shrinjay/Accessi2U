import { RenderingEntity, Room } from 'database';
import { prisma } from '../../config/prisma.js';

export const renderingEntity = async (room: Room): Promise<RenderingEntity> => {
  return await prisma.renderingEntity.findUniqueOrThrow({
    where: {
      id: room.rendering_entity_id,
    },
  });
};
