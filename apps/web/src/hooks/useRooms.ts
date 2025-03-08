import { Room } from 'database';
import { trpc } from '../trpc';
import { useMemo, useState } from 'react';

export type RoomViewModel = Partial<
  Omit<Room, 'created_at' | 'updated_at'> & {
    created_at: string;
    updated_at: string;
    geoJson: GeoJSON.Feature;
  }
>;

export const useRooms = (roomIds?: number[]) => {
  const { isLoading, data: rooms } = trpc.listRooms.useQuery({ roomIds }, { enabled: true });
  const { isLoading: isRendering, data: roomGeoJsons } = trpc.render.useQuery({
    renderingEntitiyIds: rooms?.map((room) => room.rendering_entity_id) || [],
  });

  const geoJsonByRoomID = useMemo(() => {
    if (!rooms || !roomGeoJsons) return;

    return rooms?.reduce(
      (acc, room) => {
        const roomRenderingEntityID = room.rendering_entity_id;
        const roomRenderingEntity = roomGeoJsons.find((geoJson) => geoJson.id === roomRenderingEntityID);

        if (!roomRenderingEntity) return acc;

        return {
          ...acc,
          [room.id]: roomRenderingEntity.geoJson,
        };
      },
      {} as Record<number, Room>,
    );
  }, [rooms, roomGeoJsons]);

  const roomVMs = useMemo(() => {
    if (!rooms || !geoJsonByRoomID) return;

    return rooms.map((room) => {
      return {
        ...room,
        geoJson: geoJsonByRoomID[room.id],
      };
    });
  }, [rooms, geoJsonByRoomID]);

  return {
    isLoading: isLoading || isRendering,
    rooms: roomVMs,
  };
};
