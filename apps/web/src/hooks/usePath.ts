import { trpc } from '../trpc';
import { useRooms } from './useRooms';

export const usePath = (fromRoomId: number, toRoomId: number) => {
  // path is an array of edges with a room ID each
  const { data: path, isLoading } = trpc.generateRoute.useQuery(
    {
      fromRoomId,
      toRoomId,
    },
    { enabled: !!fromRoomId && !!toRoomId },
  );

  const { rooms: roomsAlongPath } = useRooms(
    { roomIds: [fromRoomId, ...(path?.map((edge) => edge.room_id)?.filter(Boolean) || []), toRoomId] },
    !isLoading && !!fromRoomId && !!toRoomId,
  );

  return {
    path,
    roomsAlongPath,
  };
};
