import { useMemo } from 'react';
import { trpc } from '../trpc';
import { useRooms } from './useRooms';
import { Edge, Building, Floor, Room } from 'database';

export const usePath = (fromRoomId: number, toRoomId: number) => {
  // path is an array of edges with a room ID each
  const { data: path, status, mutateAsync } = trpc.generateRoute.useMutation({});

  const { rooms: roomsAlongPath, isLoading: isLoadingRooms } = useRooms(
    { roomIds: [fromRoomId, ...(path?.map((edge) => edge.room_id)?.filter(Boolean) || []), toRoomId] },
    status !== 'pending' && !!fromRoomId && !!toRoomId,
  );

  const submit = async (elevatorOnly: boolean) => {
    if (!fromRoomId || !toRoomId) return;
    await mutateAsync({
      fromRoomId,
      toRoomId,
      elevatorOnly,
    });
  };

  const isLoading = status === 'pending' || isLoadingRooms;

  const roomsAlongPathWithEdges = useMemo(() => {
    if (!roomsAlongPath || !path) return [];

    const edgeByRoomID = path.reduce(
      (acc, edge) => {
        return {
          ...acc,
          [edge.room_id]: edge,
        };
      },
      {} as Record<number, Edge & { building: Building; floor: Floor; room: Room; to_floor: Floor }>,
    );

    return (
      roomsAlongPath.map((room) => {
        return {
          ...room,
          edge: edgeByRoomID[room.id],
        };
      }) || []
    );
  }, [roomsAlongPath, path]);

  return {
    submit,
    path,
    roomsAlongPath: roomsAlongPathWithEdges,
    isLoading,
  };
};
