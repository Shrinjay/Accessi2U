import { Prisma, RenderingEntity } from 'database';
import { _file } from '../file/index.js';
import { GeoJSON } from 'geojson';

export const render = async (
  renderingEntity: Prisma.RenderingEntityGetPayload<{ include: { file: true } }>,
): Promise<GeoJSON.Feature> => {
  return await _file.readGeojson(renderingEntity.file);
};
