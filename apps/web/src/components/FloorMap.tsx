import { useEffect, useMemo, useState } from 'react';
import {
  TileLayer,
  GeoJSON,
  MapContainer,
  LayersControl,
  useMap,
  LayerGroup,
  Popup,
  FeatureGroup,
} from 'react-leaflet';
import L, { divIcon } from 'leaflet';
import rooms_centroids from '../../../ingest/data/rooms_centroids_partial.json';
import 'leaflet/dist/leaflet.css';
import ReportMenu from './ReportMenu';
import { Button, Heading, useDisclosure, Text, Box, Modal, Flex } from '@chakra-ui/react';
import { useFloors } from '../hooks/useFloors';
import { RoomViewModel, useRooms } from '../hooks/useRooms';
import { useBuildings } from '../hooks/useBuildings';
import { getListHash } from '../../../server/src/lib/util';

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
  curFloor: string;
  center: [number, number];
  checkedIndex: number;
  roomsAlongPath?: RoomViewModel[];
};

const FloorMap = ({ curFloor, center, checkedIndex, roomsAlongPath }: Props) => {
  const [selectedRoom, setSelectedRoom] = useState<RoomViewModel>(null);
  const [selectedRoomName, setSelectedRoomName] = useState(null);
  const accessibilityMap = { Y: 'True', N: 'False' };
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { rooms } = useRooms();
  const { buildings } = useBuildings();

  useEffect(() => {
    if (selectedRoom != null) {
      setSelectedRoomName({ value: selectedRoom.name, label: selectedRoom.name });
    }
  }, [selectedRoom]);

  const roomIDsAlongPath = useMemo(() => {
    return roomsAlongPath?.map((room) => room.id) || [];
  }, [roomsAlongPath]);

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

    if (isCurrRoom && !isLastRoom) {
      // currently in room
      return {
        weight: 1,
        fillColor: '#0044d5',
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

    // TODO: Restore the ability to deliniate room types on path by color
    // if (checkedIndex < 0) {
    //   if (properties['USE_TYPE'] == 'Stairs' || properties['USE_TYPE'] == 'Elevators') {
    //     return {
    //       // rooms on route
    //       weight: 1,
    //       fillColor: '#ffff00',
    //       color: 'white',
    //     };
    //   } else {
    //     return {
    //       // rooms on route
    //       weight: 1,
    //       fillColor: '#ffff00',
    //       color: 'white',
    //     };
    //   }
    // } else {
    //   // at least 1 step marked as completed
    //   if (roomList.indexOf(properties['RM_NM']) < checkedIndex) {
    //     // room has been visited
    //     return {
    //       weight: 1,
    //       fillColor: '#0044d5',
    //       color: 'white',
    //     };
    //   } else if (roomList.indexOf(properties['RM_NM']) == checkedIndex) {
    //     // currently in room
    //     return {
    //       weight: 1,
    //       fillColor: '#00b32c',
    //       color: 'white',
    //     };
    //   } else if (properties['USE_TYPE'] == 'Stairs' || properties['USE_TYPE'] == 'Elevators') {
    //     // staircase or elevator on route
    //     return {
    //       weight: 1,
    //       fillColor: '#ffff00',
    //       color: 'white',
    //     };
    //   } else {
    //     // room is unvisited
    //     return {
    //       weight: 1,
    //       fillColor: '#ffff00',
    //       color: 'white',
    //     };
    //   }
    // }
  };

  const customMarkerIcon = (text) =>
    divIcon({
      className: 'icon',
      html: text,
      iconSize: [30, 30],
      iconAnchor: [10, 5],
    });

  const setIcon = ({ properties }, latlng) => {
    return L.marker(latlng, { icon: customMarkerIcon(properties.rm_id) });
  };

  const floorFilter = ({ properties }) => {
    // https://gis.stackexchange.com/questions/189988/filtering-geojson-data-to-include-in-leaflet-map
    if (properties['FL_NM'] === curFloor) {
      return true;
    } else {
      return false;
    }
  };

  const classNumFilter = ({ properties }) => {
    // https://gis.stackexchange.com/questions/189988/filtering-geojson-data-to-include-in-leaflet-map
    if (properties['FL_NM'] === curFloor && properties['rm_standard'] === 'Classroom') {
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
  console.log('r', roomsAlongPath);
  return (
    <Flex>
      <Button
        onClick={onOpen}
        size="lg"
        colorScheme="purple"
        bg="purple.500"
        fontSize="20px"
        _hover={{ bg: '#67487d' }}
        _active={{ bg: '#67487d' }}
        fontWeight="bold"
        borderRadius="6px"
        px="12px"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 75,
          marginInline: 'auto',
          zIndex: 1000,
        }}
      >
        Report Issue
      </Button>
      <MapContainer
        inertia={false}
        center={center}
        zoom={19}
        boxZoom={false}
        maxBoundsViscosity={1.0}
        maxZoom={21}
        minZoom={18}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          maxZoom={21}
          tms={true}
        />
        <ChangeView center={center} />
        <LayerGroup>
          {buildings?.map((building, index) => {
            return (
              <GeoJSON
                data={building.geoJson}
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
                  style={getRoomStyle(room, roomIDsAlongPath)}
                  filter={floorFilter}
                  key={curFloor}
                />
              </FeatureGroup>
            );
          })}

          <GeoJSON data={rooms_centroids} pointToLayer={setIcon} filter={classNumFilter} key={curFloor} />

          <LayersControl position={'topright'}>
            <LayersControl.Overlay checked={false} name={'Other Room Numbers'}>
              <GeoJSON data={rooms_centroids} pointToLayer={setIcon} filter={otherNumFilter} key={curFloor} />
            </LayersControl.Overlay>
          </LayersControl>
        </LayerGroup>
      </MapContainer>
      <Modal blockScrollOnMount={true} isOpen={isOpen} onClose={onClose}>
        <ReportMenu onClose={onClose} passedRoom={selectedRoom} defaultRoom={selectedRoomName} />
      </Modal>
    </Flex>
  );
};

export default FloorMap;
