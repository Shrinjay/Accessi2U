import { useEffect, useMemo, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import RouteChecklist from './RouteChecklist';
import FloorMap from './FloorMap';
import 'leaflet/dist/leaflet.css';
import { ArrowRightIcon, ArrowLeftIcon, ArrowUpIcon, ArrowDownIcon, EditIcon } from '@chakra-ui/icons';
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
  Spacer,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { useBuildings } from '../hooks/useBuildings';
import { FloorViewModel, useFloors } from '../hooks/useFloors';
import { RoomViewModel } from '../hooks/useRooms';

// DWE
const DEFAULT_CENTER = [43.47007771086484, -80.5395194675902];

type Props = {
  startRoom?: RoomViewModel;
  roomsAlongPath: RoomViewModel[];
  menuOpen: boolean;
  isLoading: boolean;
  changeMenuVisibility: () => void;
  resetRoute: () => void;
  chosenFloor: {};
};

const PathMap = ({
  startRoom,
  roomsAlongPath,
  menuOpen,
  isLoading,
  changeMenuVisibility,
  resetRoute,
  chosenFloor,
}: Props) => {
  const [selectedFloorId, setSelectedFloorId] = useState(undefined);
  const [selectedBuildingId, setSelectedBuildingId] = useState(undefined);
  const { buildings, isLoading: isLoadingBuildings } = useBuildings();
  const { floors, isLoading: isLoadingFloors } = useFloors();

  const selectedBuilding = buildings?.find((building) => building.id === selectedBuildingId);
  const selectedFloor = floors?.find((floor) => floor.id === selectedFloorId);

  const floorIndex = floors?.findIndex((floor) => floor.id === selectedFloorId);

  const [checkedIndex, setCheckedIndex] = useState(-1);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const checkedRoom = useMemo(() => {
    if (!roomsAlongPath?.length) return;
    return roomsAlongPath[checkedIndex + 1];
  }, [roomsAlongPath, checkedIndex]);

  const center = useMemo(() => {
    if (!!checkedRoom) return [checkedRoom.centroid_lat, checkedRoom.centroid_lon];
    if (!!startRoom) return [startRoom.centroid_lat, startRoom.centroid_lon];
    if (!!selectedBuilding) return [selectedBuilding.centroid_lat, selectedBuilding.centroid_lon];
    return DEFAULT_CENTER;
  }, [selectedBuilding, checkedRoom, startRoom]);

  useEffect(() => {
    if (!selectedBuilding && buildings?.length) {
      setSelectedBuildingId(buildings[0].id);
    }
  }, [selectedBuildingId, buildings]);

  useEffect(() => {
    if (checkedRoom) {
      setSelectedBuildingId(buildings.find((building) => building.id === checkedRoom.floor.building_id)?.id);
      setSelectedFloorId(checkedRoom.floor.id);
    } else if (startRoom) {
      setSelectedBuildingId(buildings.find((building) => building.id === startRoom.floor.building_id)?.id);
      setSelectedFloorId(startRoom.floor.id);
    }
  }, [checkedRoom, startRoom]);

  useEffect(() => {
    if (floors?.length && !selectedFloor) {
      setSelectedFloorId(floors[0].id);
    }
  }, [selectedFloorId, floors]);

  useEffect(() => {
    if (chosenFloor) {
      setSelectedFloorId(chosenFloor.value);
    }
  }, [chosenFloor]);

  useEffect(() => {
    if (chosenFloor) {
      setSelectedBuildingId(selectedFloor.building_id);
    }
  }, [selectedFloor]);

  const nextFloor = () => {
    setSelectedFloorId(floors[Math.min(floorIndex + 1, floors?.length || 0 - 1)].id);
  };

  const prevFloor = () => {
    setSelectedFloorId(floors[Math.max(floorIndex - 1, 0)].id);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextFloor(),
    onSwipedRight: () => prevFloor(),
    onSwipedUp: () => {
      console.log('up!');
    },
    onSwipedDown: onClose,
    swipeDuration: 300,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const resetPath = () => {
    resetRoute();
    setCheckedIndex(-1);
    onClose();
  };

  return (
    <Flex display="flex" justifyContent={'center'} background="white" style={{ position: 'absolute' }}>
      <FloorMap
        isLoading={isLoading || isLoadingBuildings || isLoadingFloors}
        selectedFloor={selectedFloor}
        center={center as any}
        checkedIndex={checkedIndex}
        key={selectedFloor?.id}
        roomsAlongPath={roomsAlongPath as any}
      />

      <Box
        style={{
          position: 'absolute',
          // top: 50,
          bottom: '21%',
          marginInline: 'auto',
          zIndex: 1000,
        }}
      >
        <HStack>
          {floorIndex == 0 ? (
            <> </>
          ) : (
            <>
              {' '}
              <ArrowLeftIcon
                boxSize={6}
                color={'#67487d'}
                onClick={() => prevFloor()}
                borderColor="#67487d"
                borderWidth={2}
                borderRadius={5}
              />
            </>
          )}

          <Text fontSize={'2xl'} fontWeight="bold">
            Floor: {selectedFloor?.name}
          </Text>

          {floorIndex < floors?.length - 1 ? (
            <>
              {' '}
              <ArrowRightIcon
                boxSize={6}
                color={'#67487d'}
                onClick={() => nextFloor()}
                borderColor="#67487d"
                borderWidth={2}
                borderRadius={5}
              />{' '}
            </>
          ) : (
            <> </>
          )}
        </HStack>
      </Box>

      <Drawer isOpen={!!roomsAlongPath?.length && !menuOpen} onClose={onClose} placement="bottom" {...swipeHandlers}>
        {isOpen && <DrawerOverlay />}
        <DrawerContent top={isOpen ? '15%' : '80%'}>
          <DrawerHeader>
            <HStack>
              <Heading size="md">Your Route</Heading>
              <EditIcon color={'#67487d'} onClick={() => changeMenuVisibility()} />
              <Spacer />
              <Button
                onClick={isOpen ? onClose : onOpen}
                size="sm"
                colorScheme="yellow"
                bg="yellow.500"
                fontSize="20px"
                _hover={{ bg: '#D99A00' }}
                _active={{ bg: '#C78C00' }}
                fontWeight="bold"
                borderRadius="6px"
                p={4}
              >
                {isOpen ? <ArrowDownIcon /> : <ArrowUpIcon />}
              </Button>
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <RouteChecklist
              roomsAlongPath={roomsAlongPath}
              setCheckedIndex={setCheckedIndex}
              checkedIndex={checkedIndex}
              isOpened={isOpen}
              resetRoute={resetPath}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default PathMap;
