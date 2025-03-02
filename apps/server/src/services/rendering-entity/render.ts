import { Prisma, RenderingEntity } from 'database';
import { _file } from '../file/index.js';

export const render = async (
  renderingEntity: Prisma.RenderingEntityGetPayload<{ include: { file: true } }>,
): Promise<GeoJSON.FeatureCollection> => {
  return await _file.readGeojson(renderingEntity.file);
};
