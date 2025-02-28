import { trpc } from '../trpc';

export const useBuildings = () => {
  const { isLoading, data: buildings } = trpc.listBuildings.useQuery(undefined);
  const { isLoading: isRendering, data: buildingGeoJsons } = trpc.render.useQuery({
    renderingEntitiyIds: buildings?.map((room) => room.id) || [],
  });

  return {
    isLoading: isLoading || isRendering,
    buildings,
    buildingGeoJsons,
  };
};
