import { trpc } from '../trpc';

export const useFloors = () => {
  const { isLoading, data: floors } = trpc.listFloors.useQuery(undefined);
  const { isLoading: isRendering, data: floorGeojsons } = trpc.render.useQuery({
    renderingEntitiyIds: floors?.map((room) => room.id) || [],
  });

  return {
    isLoading: isLoading || isRendering,
    floors,
    floorGeojsons,
  };
};
