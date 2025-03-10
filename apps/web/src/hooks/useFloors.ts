import { Floor } from 'database';
import { trpc } from '../trpc';
import { useMemo } from 'react';

export type FloorViewModel = Partial<
  Omit<Floor, 'created_at' | 'updated_at'> & {
    created_at: string;
    updated_at: string;
    geoJson?: GeoJSON.Feature;
  }
>;

export const useFloors = (buildingId?: number, enabled = true) => {
  const { isLoading, data: floors } = trpc.listFloors.useQuery({ buildingId }, { enabled });

  const { isLoading: isRendering, data: floorGeoJsons } = trpc.render.useQuery({
    renderingEntitiyIds: floors?.map((floor) => floor.rendering_entity_id) || [],
  });

  const geoJsonByFloorID = useMemo(() => {
    if (!floors || !floorGeoJsons) return;

    return floors?.reduce(
      (acc, floor) => {
        const floorRenderingEntityID = floor.rendering_entity_id;
        const floorRenderingEntity = floorGeoJsons.find((geoJson) => geoJson.id === floorRenderingEntityID);

        if (!floorRenderingEntity) return acc;

        return {
          ...acc,
          [floor.id]: floorRenderingEntity.geoJson,
        };
      },
      {} as Record<number, FloorViewModel>,
    );
  }, [floors, floorGeoJsons]);

  const floorVMs = useMemo(() => {
    if (!floors || !geoJsonByFloorID) return;

    return floors.map((floor) => {
      return {
        ...floor,
        geoJson: geoJsonByFloorID[floor.id],
      };
    });
  }, [floors, geoJsonByFloorID]);

  return {
    isLoading: isLoading || isRendering,
    floors: floorVMs,
  };
};
