import { useEffect, useMemo, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import RouteChecklist from './RouteChecklist';
import FloorMap from './FloorMap';
import MapLegend from './MapLegend';
import 'leaflet/dist/leaflet.css';
import { ArrowRightIcon, ArrowLeftIcon } from '@chakra-ui/icons';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  useDisclosure,
  Box,
  Text,
  Flex,
  HStack,
} from '@chakra-ui/react';
import { usePath } from '../hooks/usePath';
import { useBuildings } from '../hooks/useBuildings';
import { useFloors } from '../hooks/useFloors';
import { useRooms } from '../hooks/useRooms';
// DWE
const DEFAULT_CENTER = [43.47007771086484, -80.5395194675902];

type Props = {
  startRoomId: number;
  endRoomId: number;
};

const PathMap = ({ startRoomId, endRoomId }: Props) => {
  const [selectedFloorId, setSelectedFloorId] = useState(undefined);
  const [selectedBuildingId, setSelectedBuildingId] = useState(undefined);

  const { buildings } = useBuildings();
  const { floors } = useFloors(selectedBuildingId, !!selectedBuildingId);

  const selectedBuilding = buildings?.find((building) => building.id === selectedBuildingId);
  const selectedFloor = floors?.find((floor) => floor.id === selectedFloorId);

  const floorIndex = floors?.findIndex((floor) => floor.id === selectedFloorId);

  const [checkedIndex, setCheckedIndex] = useState(-1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { roomsAlongPath } = usePath(startRoomId, endRoomId);

  const checkedRoom = useMemo(() => {
    if (!roomsAlongPath?.length) return;
    return roomsAlongPath[checkedIndex + 1];
  }, [roomsAlongPath, checkedIndex]);

  const center = useMemo(() => {
    if (!!checkedRoom) return [checkedRoom.centroid_lat, checkedRoom.centroid_lon];
    if (!!selectedBuilding) return [selectedBuilding.centroid_lat, selectedBuilding.centroid_lon];
    return DEFAULT_CENTER;
  }, [selectedBuilding, checkedRoom]);

  useEffect(() => {
    if (!selectedBuilding && buildings?.length) {
      setSelectedBuildingId(buildings[0].id);
    }
  }, [selectedBuildingId, buildings]);

  useEffect(() => {
    if (checkedRoom) {
      setSelectedBuildingId(buildings.find((building) => building.id === checkedRoom.floor.building_id)?.id);
      setSelectedFloorId(checkedRoom.floor.id);
    }
  }, [checkedRoom]);

  console.log('selectedFloor', selectedFloor);

  useEffect(() => {
    if (floors?.length && !selectedFloor) {
      setSelectedFloorId(floors[0].id);
    }
  }, [selectedFloorId, floors]);

  const nextFloor = () => {
    setSelectedFloorId(floors[Math.min(floorIndex + 1, floors?.length || 0 - 1)].id);
  };

  const prevFloor = () => {
    setSelectedFloorId(floors[Math.max(floorIndex - 1, 0)].id);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextFloor(),
    onSwipedRight: () => prevFloor(),
    onSwipedUp: onOpen,
    onSwipedDown: onClose,
    swipeDuration: 200,
    preventScrollOnSwipe: false,
    trackMouse: true,
  });

  return (
    <Flex display="flex" justifyContent={'center'} background="white" {...swipeHandlers} style={{position: "absolute"}}>
      <FloorMap
        selectedFloor={selectedFloor}
        center={center as any}
        checkedIndex={checkedIndex}
        key={selectedFloor?.id}
        roomsAlongPath={roomsAlongPath as any}
      />

      <Box
        style={{
          position: 'absolute',
          top: 50,
          marginInline: 'auto',
          zIndex: 1000,
        }}>
        <HStack>
          {floorIndex == 0 ? (<> </>) : (
            <> <ArrowLeftIcon
                boxSize={6}
                color={'#67487d'}
                onClick={() => prevFloor()}
                borderColor='#67487d'
                borderWidth={2}
                borderRadius={5}
            /></>
          )}

          <Text
            fontSize={'2xl'}
            fontWeight="bold"
          >
            Floor: {selectedFloor?.name}
          </Text>

          {floorIndex < floorList.length - 1 ? (
            <> <ArrowRightIcon
                boxSize={6}
                color={'#67487d'}
                onClick={() => nextFloor()}
                borderColor='#67487d'
                borderWidth={2}
                borderRadius={5}/> </>
          ) : (<> </>)}
        </HStack>

      </Box>

      <Button
        onClick={onOpen}
        size="lg"
        colorScheme="yellow"
        bg="yellow.500"
        fontSize="20px"
        _hover={{ bg: '#D99A00' }}
        _active={{ bg: '#C78C00' }}
        fontWeight="bold"
        borderRadius="6px"
        px="12px"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 5,
          marginInline: 'auto',
          zIndex: 1000,
        }}
      >
        Open Checklist
      </Button>

      <Drawer isOpen={isOpen} onClose={onClose} placement="bottom" isFullHeight={true}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Heading size="md">Step-by-Step Route</Heading>
          </DrawerHeader>
          <DrawerBody>
            <RouteChecklist
              roomsAlongPath={roomsAlongPath}
              setCheckedIndex={setCheckedIndex}
              checkedIndex={checkedIndex}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default PathMap;
