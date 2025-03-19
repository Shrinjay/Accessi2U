import { useEffect, useState } from 'react';
import {
  Checkbox,
  StackDivider,
  Heading,
  Stack,
  Box,
  HStack,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Spacer,
} from '@chakra-ui/react';
import { theme } from '../styles';
import { RoomViewModel, RoomTypeEnum } from '../hooks/useRooms';

type Step = {
  index: number;
  roomName: string;
  instructions: string;
};

type Props = {
  roomsAlongPath: RoomViewModel[];
  checkedIndex: number;
  setCheckedIndex: (index: number) => void;
  isOpened: boolean;
  resetRoute: () => void;
};

export default function RouteChecklist({ roomsAlongPath, checkedIndex, setCheckedIndex, isOpened, resetRoute }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toStep = (room: RoomViewModel, index: number): Step => {
    const partialStep = {
      index: index,
      roomName: room.name,
    };

    if (index === 0) {
      return {
        ...partialStep,
        instructions: `Start at room ${room.name}`,
      };
    }

    if (index === roomsAlongPath.length - 1) {
      return {
        ...partialStep,
        instructions: `Arrive at room ${room.name}`,
      };
    }

    const nextStep = roomsAlongPath[index + 1];

    switch (room.roomType) {
      case RoomTypeEnum.CORRIDOR:
        if (nextStep.roomType === RoomTypeEnum.ELEVATOR) {
          return {
            ...partialStep,
            instructions: `Walk down the hallway until you reach the elevator`,
          };
        }
        if (nextStep.roomType === RoomTypeEnum.STAIR) {
          return {
            ...partialStep,
            instructions: `Walk down the hallway until you reach the stairs`,
          };
        }
        if (nextStep.roomType === RoomTypeEnum.CORRIDOR && nextStep.area >= 2.5e-8) {
          return {
            ...partialStep,
            instructions: `Walk down the hallway until you reach the atrium`,
          };
        }
        if (nextStep.roomType === RoomTypeEnum.CORRIDOR) {
          return {
            ...partialStep,
            instructions: `Walk down the hallway until you reach the end`,
          };
        }
        return {
          ...partialStep,
          instructions: `Walk down the hallway until you reach room ${nextStep.name}`,
        };

      case RoomTypeEnum.ELEVATOR:
        return {
          ...partialStep,
          instructions: `Take the elevator to floor ${room.edge.to_floor.level}`,
        };
      case RoomTypeEnum.STAIR:
        return {
          ...partialStep,
          instructions: `Take the stairs to floor ${room.edge.to_floor.level}`,
        };
      default:
        return {
          ...partialStep,
          instructions: `Go to room ${room.name} next`,
        };
    }
  };

  const steps: Step[] = roomsAlongPath?.map((room, index) => toStep(room, index)) || [];

  const handleCheck = (event) => {
    if (event.target.checked) {
      setCheckedIndex(parseInt(event.target.value));
    } else {
      setCheckedIndex(parseInt(event.target.value) - 1);
    }
  };

  return (
    <>
      <Stack divider={<StackDivider />} spacing="3">
        {steps
          .sort((a, b) => {
            if (isOpened) return a.index - b.index;

            const isChecked = (index: number) => {
              return index <= checkedIndex;
            };

            if (isChecked(a.index) && isChecked(b.index)) return a.index - b.index;
            if (isChecked(a.index)) return 1;
            if (isChecked(b.index)) return -1;
          })
          .map((room) => (
            <Box key={room.index} style={theme}>
              <HStack>
                <Heading size="sm" textTransform="uppercase">
                  <b>#{room.index + 1}:</b> {room.roomName}
                </Heading>
                <Spacer />
                <Checkbox
                  value={room.index}
                  size="md"
                  isChecked={room.index <= checkedIndex}
                  onChange={handleCheck}
                />
              </HStack>

              <Text>{room.instructions}</Text>
            </Box>
          ))}
        <Button
          alignSelf="center"
          mb="2"
          size="lg"
          colorScheme="yellow"
          bg="yellow.500"
          fontSize="20px"
          _hover={{ bg: '#D99A00' }}
          _active={{ bg: '#C78C00' }}
          fontWeight="bold"
          borderRadius="6px"
          px="6px"
          onClick={onOpen}
        >
          Route Completed
        </Button>
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={true}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader ml={2}>Confirm Exit</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box
                bg="white"
                boxShadow="sm"
                flexDirection="column"
                padding={1}
              >
                <Text fontSize="md" mt={-1}>
                  Clicking "Confirm" will exit the current route and return to route select screen. Click "Cancel" to
                  return to the current route.
                </Text>

                <HStack spacing={6} mt={3}>
                  <Button
                    size="md"
                    colorScheme="yellow"
                    bg="yellow.500"
                    fontSize="20px"
                    _hover={{ bg: '#D99A00' }}
                    _active={{ bg: '#C78C00' }}
                    fontWeight="bold"
                    borderRadius="6px"
                    px="6px"
                    onClick={resetRoute}
                  >
                    Confirm
                  </Button>

                  <Button
                    size="md"
                    colorScheme="purple"
                    bg="purple.500"
                    fontSize="20px"
                    _hover={{ bg: '#67487d' }}
                    _active={{ bg: '#67487d' }}
                    fontWeight="bold"
                    borderRadius="6px"
                    px="6px"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>

                </HStack>
              </Box>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}
