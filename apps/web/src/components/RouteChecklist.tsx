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
};

export default function RouteChecklist({ roomsAlongPath, checkedIndex, setCheckedIndex, isOpened }: Props) {
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

    switch (room.roomType) {
      case RoomTypeEnum.CORRIDOR:
        return {
          ...partialStep,
          instructions: `Walk down hallway ${room.name} until you reach the end of the hallway`,
        };
      case RoomTypeEnum.ELEVATOR:
        return {
          ...partialStep,
          instructions: `Take the elevator ${room.name} the next floor`,
        };
      case RoomTypeEnum.STAIR:
        return {
          ...partialStep,
          instructions: `Take the stairs to the next floor`,
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
                  {room.roomName}
                </Heading>
                <Spacer />
                <Checkbox
                  value={room.index}
                  size="md"
                  isChecked={room.index <= checkedIndex}
                  onChange={handleCheck}
                ></Checkbox>
              </HStack>

              <Text>{room.instructions}</Text>
            </Box>
          ))}
        {/* TODO: Make this work the way Carter expected it to */}
        {/* <Button
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
        </Button> */}
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
                display="flex"
                flexDirection="column"
                my="-1"
                alignItems="left"
                padding={2}
              >
                <Text fontSize="md" mb={2} mt={-1}>
                  Clicking "Confirm" will exit the current route and return to route select screen. Click "Cancel" to
                  return to the current route.
                </Text>

                <HStack align="center" spacing={5}>
                  <Button
                    alignSelf="center"
                    mt="2"
                    size="md"
                    colorScheme="yellow"
                    bg="yellow.500"
                    fontSize="20px"
                    _hover={{ bg: '#D99A00' }}
                    _active={{ bg: '#C78C00' }}
                    fontWeight="bold"
                    borderRadius="6px"
                    px="6px"
                  >
                    Confirm
                  </Button>
                  <Button
                    alignSelf="center"
                    mt="2"
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
