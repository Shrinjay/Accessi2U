import { Building } from 'database';
import { trpc } from '../trpc';
import { useMemo } from 'react';

export type BuildingViewModel = Building & {
  geoJson: GeoJSON.Feature;
};

export const useBuildings = () => {
  const { isLoading, data: buildings } = trpc.listBuildings.useQuery(undefined, { enabled: true });

  const { isLoading: isRendering, data: buildingGeoJsons } = trpc.render.useQuery({
    renderingEntitiyIds: buildings?.map((building) => building.rendering_entity_id) || [],
  });

  const geoJsonByBuildingID = useMemo(() => {
    if (!buildings || !buildingGeoJsons) return;

    return buildings?.reduce(
      (acc, buulding) => {
        const buildingRenderingEntityID = buulding.rendering_entity_id;
        const buildingRenderingEntity = buildingGeoJsons.find((geoJson) => geoJson.id === buildingRenderingEntityID);

        if (!buildingRenderingEntity) return acc;

        return {
          ...acc,
          [buulding.id]: buildingRenderingEntity.geoJson,
        };
      },
      {} as Record<number, BuildingViewModel>,
    );
  }, [buildings, buildingGeoJsons]);

  const buildingVMs = useMemo(() => {
    if (!buildings || !geoJsonByBuildingID) return;

    return buildings.map((buulding) => {
      return {
        ...buulding,
        geoJson: geoJsonByBuildingID[buulding.id],
      };
    });
  }, [buildings, geoJsonByBuildingID]);

  return {
    isLoading: isLoading || isRendering,
    buildings: buildingVMs,
  };
};
