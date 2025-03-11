import { trpc } from '../trpc';
import { useRooms } from './useRooms';

export const usePath = (fromRoomId: number, toRoomId: number) => {
  // path is an array of edges with a room ID each
  const { data: path, status, mutateAsync } = trpc.generateRoute.useMutation({});
  const isLoading = status === 'pending';

  const { rooms: roomsAlongPath } = useRooms(
    { roomIds: [fromRoomId, ...(path?.map((edge) => edge.room_id)?.filter(Boolean) || []), toRoomId] },
    !isLoading && !!fromRoomId && !!toRoomId,
  );

  const submit = async (elevatorOnly: boolean) => {
    if (!fromRoomId || !toRoomId) return;
    await mutateAsync({
      fromRoomId,
      toRoomId,
      elevatorOnly,
    });
  };

  return {
    submit,
    path,
    roomsAlongPath,
    isLoading,
  };
};
