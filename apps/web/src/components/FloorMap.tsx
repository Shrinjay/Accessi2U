import { useEffect, useMemo, useState } from 'react';
import { GeoJSON, MapContainer, useMap, LayerGroup, Popup, FeatureGroup, Marker } from 'react-leaflet';
import L, { divIcon } from 'leaflet';
import currentLocationIcon from './icons/marker.svg';
import elevatorIcon from './icons/elevatorIcon.svg';
import stairsIcon from './icons/stairs.svg';
import foodIcon from './icons/cutlery.svg';
import pinIcon from './icons/pin.svg';
import mensRoomIcon from './icons/washroom-men.svg';
import womensRoomIcon from './icons/washroom-women.svg';
import neutralWashroomIcon from './icons/washroom-stall.svg';
import 'leaflet/dist/leaflet.css';
import ReportMenu from './ReportMenu';
import { Button, Heading, useDisclosure, Text, Box, Modal, Flex, Center, Spinner, position } from '@chakra-ui/react';
import { FloorViewModel, useFloors } from '../hooks/useFloors';
import { RoomViewModel, useRooms } from '../hooks/useRooms';
import { useBuildings } from '../hooks/useBuildings';
import { getListHash } from '../../../server/src/lib/util';
import { Floor } from 'database';
import { Point } from 'geojson';
import { ZoomChild } from './core/ZoomChild';
import { ReportsSummary } from './ReportsSummary';
import 'leaflet-rotatedmarker';
import { GeolocationService } from '../services/geolocation';
import engWashrooms from '../../../ingest/data/Eng_Washrooms.json';

function ChangeView({ center, heading }) {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
      map.panTo(center);
    }, 250);
  }, [center]);
  return null;
}

type Props = {
  selectedFloor: FloorViewModel;
  center: [number, number];
  checkedIndex: number;
  roomsAlongPath?: RoomViewModel[];
  isLoading: boolean;
};

const ROOM_TYPES_TO_NOT_SHOW_CENTROIDS_FOR = ['Corridor/Circulation Area'];
const ROOM_TYPES_FOR_ICONS = ['Elevators', 'Stairs', 'Toilets/Showers'];

const roomToCentroidGeoJson = (room: RoomViewModel): GeoJSON.Feature => ({
  type: 'Feature',
  properties: { rm_id: room.id, RM_NM: room.name, rm_standard: room.roomType },
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

  const [heading, setHeading] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const curFloor = selectedFloor?.name;
  const { rooms } = useRooms({ floorId: selectedFloor?.id });
  const { buildings } = useBuildings();

  const roomCentroids = rooms?.filter((room) => {
    const shouldBeShown = !ROOM_TYPES_TO_NOT_SHOW_CENTROIDS_FOR.includes(room.roomType);
    return (room.area > getMinArea(zoomLevel) && shouldBeShown) || ROOM_TYPES_FOR_ICONS.includes(room.roomType);
  });

  useEffect(() => {
    if (selectedRoom != null) {
      setSelectedRoomName({ value: selectedRoom.name, label: selectedRoom.name });
    }
  }, [selectedRoom]);

  const roomIDsAlongPath = useMemo(() => {
    return roomsAlongPath?.map((room) => room.id) || [];
  }, [roomsAlongPath]);

  const initGeolocation = async () => {
    const geolocationService = new GeolocationService();
    await geolocationService.start();
    geolocationService.addEventListener('update', (event: any) => {
      setHeading(isNaN(event.detail.compassHeading) ? 0 : event.detail.compassHeading);
    });
  };

  useEffect(() => {
    initGeolocation();
  }, []);

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
        fillColor: 'green',
        color: 'white',
      };
    }

    if (isNextRoom && !isLastRoom) {
      // rooms on route
      return {
        weight: 1,
        fillColor: 'yellow',
        color: 'white',
      };
    }

    if (isLastRoom) {
      return {
        weight: 1,
        fillColor: 'magenta',
        color: 'white',
      };
    }
  };

  const getCurrentLocationIcon = () => {
    return new L.Icon({
      iconUrl: currentLocationIcon,
      iconSize: [48, 48],
    });
  };

  const getRoomIcon = (room: RoomViewModel, roomIDsAlongPath: number[]) => {
    const roomGeoJson = roomToCentroidGeoJson(room);
    const properties = roomGeoJson.properties;

    const final_id = roomIDsAlongPath[roomIDsAlongPath.length - 1];
    const isAlongPath = roomIDsAlongPath.includes(room.id);

    if (final_id && final_id == room.id) {
      return new L.divIcon({
        className: 'icon',
        style: {
          fontSize: '10px',
        },
        html: `<object data=${pinIcon} type="image/svg+xml"  class="logo"> </object>
          <p style="font-size:10px;">${properties.RM_NM.split(' ')[1]}</p>
          `,
        iconSize: [30, 30],
      });
    } else if (properties.rm_standard == 'Elevators') {
      return new L.divIcon({
        className: 'icon',
        style: {
          fontSize: '10px',
        },
        html: `
        <object data=${elevatorIcon} type="image/svg+xml"  />
        `,
        iconSize: [30, 30],
      });
    } else if (properties.rm_standard == 'Stairs') {
      return new L.divIcon({
        className: 'icon',
        style: {
          fontSize: '10px',
        },
        html: `
        <object data=${stairsIcon} type="image/svg+xml"  />
        `,
        iconSize: [30, 30],
      });
    } else if (properties.rm_standard == 'Toilets/Showers') {
      var washroom = engWashrooms[properties.RM_NM];

      if (washroom) {
        let washroomType = washroom.Gender;

        if (washroomType == 'M') {
          return new L.Icon({
            iconUrl: mensRoomIcon,
            iconSize: [20, 20],
          });
        } else if (washroomType == 'W') {
          return new L.Icon({
            iconUrl: womensRoomIcon,
            iconSize: [20, 20],
          });
        } else if (washroomType == 'GN') {
          return new L.Icon({
            iconUrl: neutralWashroomIcon,
            iconSize: [20, 20],
          });
        }
      }
    } else if (properties.rm_standard == 'Food Facilities') {
      return new L.Icon({
        iconUrl: foodIcon,
        iconSize: [20, 20],
      });
    }

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

  const floorFilter = ({ properties }) => {
    // https://gis.stackexchange.com/questions/189988/filtering-geojson-data-to-include-in-leaflet-map
    if (properties['FL_NM'] === curFloor) {
      return true;
    } else {
      return false;
    }
  };

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

        <ChangeView center={center} heading={heading} />

        <LayerGroup>
          {currRoom && (
            <>
              <Marker
                key={heading}
                position={[currRoom?.geoJson?.properties?.lat, currRoom?.geoJson?.properties?.lon]}
                // @ts-ignore
                icon={getCurrentLocationIcon()}
                rotationAngle={heading}
                rotationOrigin={'center'}
              />
            </>
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
                  <Box bg="white" boxShadow="sm" display="flex" flexDirection="column" p="1" gap="0">
                    <Heading size="md" fontSize="lg" textAlign="center" mt="0px">
                      {room.name}
                    </Heading>

                    <Text fontSize="sm" fontWeight="normal">
                      <strong>Room Type:</strong> {room.geoJson.properties.rm_standard}
                    </Text>
                    <Text fontSize="sm" fontWeight="normal">
                      <strong>Department:</strong> {room.geoJson.properties.Departments_name}
                    </Text>
                    <Text fontSize="sm" fontWeight="normal">
                      <strong>Accessible:</strong> {accessibilityMap[room.geoJson.properties.brg_accessible]}
                    </Text>
                    <Text fontSize="sm" fontWeight="normal">
                      <strong>Reports:</strong> <ReportsSummary roomId={room.id} />
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
            const roomGeoJson = roomToCentroidGeoJson(room);
            return (
              <Marker
                position={(roomGeoJson.geometry as Point).coordinates}
                // @ts-ignore
                icon={getRoomIcon(room, roomIDsAlongPath)}
              />
            );
          })}

          {/* {roomCentroids?.map?.((room, index) => {
            return (
              <Marker
                position={(room.geometry as Point).coordinates}
                // @ts-ignore
                icon={getRoomNameLabel(room, (room.geometry as Point).coordinates)}
              />
            );
          })} */}
        </LayerGroup>
      </MapContainer>
      <Modal blockScrollOnMount={true} isOpen={isOpen} onClose={onClose}>
        <ReportMenu onClose={onClose} selectedRoom={selectedRoom} />
      </Modal>
    </Flex>
  );
};

export default FloorMap;
