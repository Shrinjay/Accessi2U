import * as Yup from 'yup';
import { procedure } from '../procedure.js';
import { prisma } from '../../config/prisma.js';
import { _renderingEntity } from '../../services/rendering-entity/index.js';
import { RenderingEntity } from 'database';

const input = Yup.object({
  renderingEntitiyIds: Yup.array().of(Yup.number()).required(),
});

export type RenderedEntity = RenderingEntity & {
  geoJson: GeoJSON.Feature;
};

export const render = procedure.input(input).query(async ({ ctx, input }) => {
  try {
    const { renderingEntitiyIds } = input;

    const renderingEntities = await prisma.renderingEntity.findMany({
      where: { id: { in: renderingEntitiyIds } },
      include: { file: true },
    });

    const renderedEntities = await Promise.all(
      renderingEntities.map(async (renderingEntity) => {
        const geoJson = await _renderingEntity.render(renderingEntity);

        return {
          ...renderingEntity,
          geoJson,
        };
      }),
    );

    return renderedEntities;
  } catch (error) {
    console.error(error);
    throw error;
  }
});
