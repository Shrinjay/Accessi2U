import * as Yup from 'yup';
import { procedure } from '../procedure.js';
import { prisma } from '../../config/prisma.js';
import { _renderingEntity } from '../../services/rendering-entity/index.js';

const input = Yup.object({
  renderingEntitiyIds: Yup.array().of(Yup.number()).required(),
});

export const render = procedure.input(input).query(async ({ ctx, input }) => {
  const { renderingEntitiyIds } = input;

  const renderingEntities = await prisma.renderingEntity.findMany({
    where: { id: { in: renderingEntitiyIds } },
    include: { file: true },
  });

  const renderedEntities = await Promise.all(
    renderingEntities.map(async (renderingEntity) => {
      return await _renderingEntity.render(renderingEntity);
    }),
  );

  return renderedEntities;
});
