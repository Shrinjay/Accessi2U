import { useEffect, useMemo, useRef, useState } from 'react';
import {
  TileLayer,
  GeoJSON,
  MapContainer,
  LayersControl,
  useMap,
  LayerGroup,
  Popup,
  FeatureGroup,
  Marker,
  Tooltip,
  useMapEvents,
} from 'react-leaflet';
import L, { divIcon } from 'leaflet';
import currentLocationIcon from './icons/circle-solid.svg';
import 'leaflet/dist/leaflet.css';
import ReportMenu from './ReportMenu';
import { Button, Heading, useDisclosure, Text, Box, Modal, Flex, Center, Spinner } from '@chakra-ui/react';
import { FloorViewModel, useFloors } from '../hooks/useFloors';
import { RoomViewModel, useRooms } from '../hooks/useRooms';
import { useBuildings } from '../hooks/useBuildings';
import { getListHash } from '../../../server/src/lib/util';
import { Floor } from 'database';
import { Point } from 'geojson';
import MapLegend from './MapLegend';
import { ZoomChild } from './core/ZoomChild';
import { ReportsSummary } from './ReportsSummary';

function ChangeView({ center }) {
  const map = useMap();
  map.panTo(center);

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 250);
  }, [map]);
  return null;
}

type Props = {
  selectedFloor: FloorViewModel;
  center: [number, number];
  checkedIndex: number;
  roomsAlongPath?: RoomViewModel[];
  isLoading: boolean;
};

const ROOM_TYPES_TO_NOT_SHOW_CENTROIDS_FOR = ['Corridor/Circulation Area', 'Stairs', 'Elevators'];

const roomToCentroidGeoJson = (room: RoomViewModel): GeoJSON.Feature => ({
  type: 'Feature',
  properties: { rm_id: room.id, RM_NM: room.name },
  geometry: { type: 'Point', coordinates: [room.centroid_lat, room.centroid_lon] },
});

const getMinArea = (zoomLevel: number) => {
  if (zoomLevel <= 19) {
    return 4e-9;
  }

  if (zoomLevel > 19) {
    return 1e-9;
  }
};

const FloorMap = ({ selectedFloor, center, checkedIndex, roomsAlongPath, isLoading }: Props) => {
  const [selectedRoom, setSelectedRoom] = useState<RoomViewModel>(null);
  const [selectedRoomName, setSelectedRoomName] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(19);
  const accessibilityMap = { Y: 'True', N: 'False' };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const curFloor = selectedFloor?.name;
  const { rooms } = useRooms({ floorId: selectedFloor?.id });
  const { buildings } = useBuildings();

  const roomCentroids = rooms
    ?.filter((room) => {
      const shouldBeShown = !ROOM_TYPES_TO_NOT_SHOW_CENTROIDS_FOR.includes(room.roomType);
      return room.area > getMinArea(zoomLevel) && shouldBeShown;
    })
    ?.map(roomToCentroidGeoJson);

  useEffect(() => {
    if (selectedRoom != null) {
      setSelectedRoomName({ value: selectedRoom.name, label: selectedRoom.name });
    }
  }, [selectedRoom]);

  const roomIDsAlongPath = useMemo(() => {
    return roomsAlongPath?.map((room) => room.id) || [];
  }, [roomsAlongPath]);

  const currRoom = useMemo(() => {
    return roomsAlongPath?.[checkedIndex + 1];
  }, [roomsAlongPath, checkedIndex]);

  const getRoomStyle = (room: RoomViewModel, roomIDsAlongPath: number[]) => {
    const isAlongRoute = roomIDsAlongPath.includes(room.id);
    const isFirstRoom = roomIDsAlongPath[0] == room.id;
    const isLastRoom = roomIDsAlongPath[roomIDsAlongPath.length - 1] == room.id;

    if (!isAlongRoute) {
      // rooms not in the route
      return {
        weight: 1,
        fillColor: 'gray',
        color: 'white',
      };
    }

    const pastRooms = roomIDsAlongPath.slice(0, checkedIndex + 1);
    const currRoom = roomIDsAlongPath[checkedIndex + 1];
    const nextRooms = roomIDsAlongPath.slice(checkedIndex + 2);
    const isPastRoom = pastRooms.includes(room.id);
    const isCurrRoom = currRoom == room.id;
    const isNextRoom = nextRooms.includes(room.id);

    if (isPastRoom) {
      // rooms on route
      return {
        weight: 1,
        fillColor: '#00b32c',
        color: 'white',
      };
    }

    if (isNextRoom && !isLastRoom) {
      // rooms on route
      return {
        weight: 1,
        fillColor: 'red',
        color: 'white',
      };
    }

    if (isLastRoom) {
      return {
        weight: 1,
        fillColor: '#d500ff',
        color: 'white',
      };
    }
  };

  const getRoomNameLabel = ({ properties }, latlng) => {
    return new L.divIcon({
      className: 'icon',
      style: {
        fontSize: '10px',
      },
      html: `
      <p style="font-size:10px;">${properties.RM_NM.split(' ')[1]}</p>
      `,
      iconSize: [30, 30],
    });
  };

  const getCurrentLocationIcon = () => {
    return new L.Icon({
      iconUrl: currentLocationIcon,
      iconSize: [12, 12],
    });
  };

  const floorFilter = ({ properties }) => {
    // https://gis.stackexchange.com/questions/189988/filtering-geojson-data-to-include-in-leaflet-map
    if (properties['FL_NM'] === curFloor) {
      return true;
    } else {
      return false;
    }
  };

  // const classNumFilter = ({ properties }) => {
  //   // https://gis.stackexchange.com/questions/189988/filtering-geojson-data-to-include-in-leaflet-map
  //   if (properties['FL_NM'] === curFloor && properties['rm_standard'] === 'Classroom') {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  const otherNumFilter = ({ properties }) => {
    // https://gis.stackexchange.com/questions/189988/filtering-geojson-data-to-include-in-leaflet-map
    if (properties['FL_NM'] === curFloor && properties['rm_standard'] !== 'Classroom') {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Flex>
      <MapLegend />
      <MapContainer
        // @ts-ignore
        center={center}
        zoom={20}
        boxZoom={false}
        maxBoundsViscosity={1.0}
        maxZoom={21}
        minZoom={18}
      >
        {isLoading && (
          <Center h="full" bg="blackAlpha.200">
            <Spinner size="xl" />
          </Center>
        )}
        <ZoomChild setZoomLevel={setZoomLevel} />
        {/* <TileLayer
          //  @ts-ignore
          // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://tile.osm.ch/switzerland/{z}/{x}/{y}.png'
          maxZoom={21}
          tms={true}
        /> */}
        <ChangeView center={center} />
        <LayerGroup>
          {currRoom && (
            <Marker
              position={[currRoom?.geoJson?.properties?.lat, currRoom?.geoJson?.properties?.lon]}
              // @ts-ignore
              icon={getCurrentLocationIcon()}
            />
          )}
          {buildings?.map((building, index) => {
            return (
              <GeoJSON
                data={building.geoJson}
                // @ts-ignore
                style={{
                  weight: 1,
                  fillColor: 'grey',
                  color: 'white',
                }}
              />
            );
          })}
          {rooms?.map((room, index) => {
            // console.log(roomIDsAlongPath);
            return (
              <FeatureGroup key={index}>
                <Popup>
                  <Box bg="white" boxShadow="sm" display="flex" flexDirection="column" my="-1">
                    <Heading size="md" fontSize="lg" textAlign="center" mt="0px">
                      {room.name}
                    </Heading>

                    <Text fontSize="sm" fontWeight="normal">
                      Room Type: {room.geoJson.properties.rm_standard}
                    </Text>
                    <Text fontSize="sm" fontWeight="normal">
                      Department: {room.geoJson.properties.Departments_name}
                    </Text>
                    <Text fontSize="sm" fontWeight="normal">
                      Accessible: {accessibilityMap[room.geoJson.properties.brg_accessible]}
                    </Text>

                    <Text fontSize="sm" fontWeight="normal">
                      Reports: <ReportsSummary roomId={room.id} />
                    </Text>

                    <Button
                      size="sm"
                      colorScheme="yellow"
                      bg="yellow.500"
                      fontSize="14px"
                      _hover={{ bg: '#D99A00' }}
                      _active={{ bg: '#C78C00' }}
                      fontWeight="bold"
                      borderRadius="6px"
                      px="6px"
                      alignSelf="center"
                      onClick={onOpen}
                      onMouseOver={() => setSelectedRoom(room)}
                    >
                      Report Issue
                    </Button>
                  </Box>
                </Popup>
                <GeoJSON
                  key={getListHash([room.geoJson, getRoomStyle(room, roomIDsAlongPath)])}
                  data={room.geoJson}
                  // @ts-expect-error
                  style={getRoomStyle(room, roomIDsAlongPath)}
                  filter={floorFilter}
                />
              </FeatureGroup>
            );
          })}

          {roomCentroids?.map?.((room, index) => {
            return (
              <Marker
                position={(room.geometry as Point).coordinates}
                // @ts-ignore
                icon={getRoomNameLabel(room, (room.geometry as Point).coordinates)}
              />
            );
          })}
        </LayerGroup>
      </MapContainer>
      <Modal blockScrollOnMount={true} isOpen={isOpen} onClose={onClose}>
        <ReportMenu onClose={onClose} selectedRoom={selectedRoom} />
      </Modal>
    </Flex>
  );
};

export default FloorMap;
