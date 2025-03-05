import { File } from 'database';
import { fileSystem, FileSystems } from '../../lib/file-system/file-system.js';
import { GeoJSON } from 'geojson'

export const readGeojson = async (file: File): Promise<GeoJSON.Feature> => {
  const content = await fileSystem.read(FileSystems.LOCAL, file.external_id);
  return JSON.parse(content.toString());
};
