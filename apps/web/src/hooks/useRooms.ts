import { trpc } from '../trpc';

export const useRooms = () => {
  console.log('fuck you');
  const { isLoading, data: rooms } = trpc.listFloors.useQuery(undefined, { enabled: true });
  const { isLoading: isRendering, data: roomGeoJsons } = trpc.render.useQuery({
    renderingEntitiyIds: rooms?.map((room) => room.id) || [],
  });

  return {
    isLoading: isLoading || isRendering,
    rooms,
    roomGeoJsons,
  };
};
