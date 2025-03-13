import { Building, Edge, Floor, Room } from 'database';
import { trpc } from '../trpc';
import { useMemo, useState } from 'react';
import { FloorViewModel } from './useFloors';

export type RoomViewModel = Partial<
  Omit<Room, 'created_at' | 'updated_at'> & {
    created_at: string;
    updated_at: string;
    geoJson: GeoJSON.Feature;
    floor: FloorViewModel;

    edge?: Edge & { building: Building; floor: Floor; Room: Room; to_floor: Floor };
  }
>;

type UseRoomInput = {
  buildingId?: number;
  floorId?: number;
  roomIds?: number[];
};

export enum RoomTypeEnum {
  CORRIDOR = 'Corridor/Circulation Area',
  ELEVATOR = 'Elevators',
  STAIR = 'Stairs',
}

export const useRooms = ({ buildingId, floorId, roomIds }: UseRoomInput, enabled = true) => {
  const { isLoading, data: rooms } = trpc.listRooms.useQuery({ buildingId, floorId, roomIds }, { enabled });
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
