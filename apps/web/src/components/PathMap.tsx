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
} from '@chakra-ui/react';
import { usePath } from '../hooks/usePath';
import { useBuildings } from '../hooks/useBuildings';
import { useFloors } from '../hooks/useFloors';
import { useRooms } from '../hooks/useRooms';

const floorList = ['DWE_01', 'DWE_02', 'RCH_01', 'RCH_02', 'RCH_03', 'CPH_01', 'E2_01', 'E2_02'];
const roomList = ['RCH 101', 'RCH 122', 'RCH 123', 'RCH 119', 'RCH 103', 'RCH 105', 'RCH 120', 'RCH 212', 'RCH 301'];
const floorCentroidMap = {
  DWE_01: [-80.5395194675902, 43.47007771086484],
  DWE_02: [-80.53952030998597, 43.47007907367728],
  DWE_03: [-80.5396902053169, 43.469992313962365],
  E2_01: [-80.54026339792681, 43.47095174436507],
  E2_02: [-80.54029876765055, 43.4708671073802],
  E2_03: [-80.54026153339854, 43.47078970337546],
  E2_04: [-80.54026562642431, 43.47090151724052],
  E3_01: [-80.54077446538352, 43.47196822574825],
  E3_02: [-80.54076133981175, 43.47157752205636],
  E3_02M: [-80.54063539250274, 43.47157435469927],
  E3_03: [-80.54080600175348, 43.47177534087369],
  E3_04: [-80.54088636230847, 43.47210455206676],
  RCH_01: [-80.54072575754529, 43.47028851150243],
  RCH_02: [-80.54074830457235, 43.47027988772001],
  RCH_03: [-80.54070990351131, 43.47028662860849],
  RCH_04: [-80.54062889558605, 43.470316519377214],
  CPH_01: [-80.53934360285233, 43.470981100790695],
  CPH_02: [-80.53935044953892, 43.47102846701261],
  CPH_03: [-80.53938649136748, 43.47099393494527],
  CPH_04: [-80.53915798212466, 43.47081176584892],
  E5_01: [-80.5400302753483, 43.47289679169119],
  E5_02: [-80.53997117181834, 43.47285219949009],
  E5_03: [-80.54002546114906, 43.47277477639429],
  E5_04: [-80.54000775639598, 43.472860154288966],
  E5_05: [-80.54000775075016, 43.472860153654175],
  E5_06: [-80.54000939953679, 43.47285738994101],
  E6_01: [-80.53867463654119, 43.47302425017082],
  E6_02: [-80.53866443434609, 43.473014931764766],
  E6_03: [-80.53867265247261, 43.47302168187215],
  E6_04: [-80.53867265247261, 43.47302168187215],
  E6_05: [-80.53867265249575, 43.47302168165029],
  E6_06: [-80.53867840937606, 43.473029774807536],
  E7_01: [-80.53956609022158, 43.47295164042191],
  E7_02: [-80.53955031400253, 43.47294296388055],
  E7_03: [-80.53950770799514, 43.47296383485508],
  E7_04: [-80.53952250119977, 43.47295759431693],
  E7_05: [-80.53952427199614, 43.472957130526375],
  E7_06: [-80.539521158232, 43.47295886846611],
  E7_07: [-80.53950832265619, 43.47296141278375],
};

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
  const { rooms: startRooms } = useRooms({ roomIds: [startRoomId] }, !!startRoomId);
  const { rooms: endRooms } = useRooms({ roomIds: [endRoomId] }, !!endRoomId);

  const startRoom = startRooms?.[0];
  const endRoom = endRooms?.[0];

  const center = useMemo(() => {
    if (!!selectedBuilding) return [selectedBuilding.centroid_lat, selectedBuilding.centroid_lon];
    return DEFAULT_CENTER;
  }, [selectedBuilding]);

  useEffect(() => {
    if (!selectedBuilding && buildings?.length) {
      setSelectedBuildingId(buildings[0].id);
    }
  }, [selectedBuildingId, buildings]);

  useEffect(() => {
    if (startRoom) {
      setSelectedBuildingId(buildings.find((building) => building.id === startRoom.floor.building_id)?.id);
      setSelectedFloorId(startRoom.floor.id);
    }
  }, [startRoom]);

  console.log('selectedFloor', selectedFloor);
  console.log('selectedBuilding', selectedBuilding);

  useEffect(() => {
    if (floors?.length && !selectedFloor) {
      setSelectedFloorId(floors[0].id);
    }
  }, [selectedFloorId, floors]);

  // useEffect(() => {
  //   setCenter([floorCentroidMap[floorList[floorIndex]][1], floorCentroidMap[floorList[floorIndex]][0]]);
  // }, [floorIndex]);

  const nextFloor = () => {
    setSelectedFloorId(floors[Math.min(floorIndex + 1, floorList.length - 1)].id);
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
    <Flex display="flex" justifyContent={'center'} background="white" {...swipeHandlers}>
      <FloorMap
        selectedFloor={selectedFloor}
        center={center as any}
        checkedIndex={checkedIndex}
        key={selectedFloor?.id}
        roomsAlongPath={roomsAlongPath as any}
      />

      <MapLegend />

      <Text
        style={{
          position: 'absolute',
          top: 5,
          marginInline: 'auto',
          zIndex: 1000,
        }}
        fontSize={'2xl'}
        fontWeight="bold"
      >
        {selectedFloor?.name}
      </Text>

      {floorIndex == 0 ? (<> </>) : (
        <>
          <ArrowLeftIcon
            boxSize={10}
            color={'darkgray'}
            onClick={() => prevFloor()}
            style={{
              position: 'absolute',
              left: 0,
              top: '40%',
              zIndex: 1000,
            }}
          />{' '}
        </>
      )}

      {floorIndex < floorList.length - 1 ? (
        <>
          <ArrowRightIcon
            boxSize={10}
            color={'darkgray'}
            onClick={() => nextFloor()}
            style={{
              position: 'absolute',
              right: 0,
              top: '40%',
              zIndex: 1000,
            }}
          />
        </>
      ) : (<> </>)}

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
            <RouteChecklist roomList={roomList} setCheckedIndex={setCheckedIndex} checkedIndex={checkedIndex} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default PathMap;
