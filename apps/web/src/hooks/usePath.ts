import { trpc } from '../trpc';
import { useRooms } from './useRooms';

export const usePath = (fromRoomId: number, toRoomId: number) => {
  // path is an array of edges with a room ID each
  const { data: path } = trpc.generateRoute.useQuery({
    fromRoomId,
    toRoomId,
  });

  const { rooms: roomsAlongPath } = useRooms([
    fromRoomId,
    ...(path?.map((edge) => edge.room_id)?.filter(Boolean) || []),
    toRoomId,
  ]);

  return {
    path,
    roomsAlongPath,
  };
};
