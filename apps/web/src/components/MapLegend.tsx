import {
  Button,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Square,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import currentLocationIcon from './icons/marker.svg';
import elevatorIcon from './icons/elevatorIcon.svg';
import stairsIcon from './icons/stairs.svg';
import pinIcon from './icons/pin.svg';
import mensRoomIcon from './icons/washroom-men.svg';
import womensRoomIcon from './icons/washroom-women.svg';
import neutralWashroomIcon from './icons/washroom-stall.svg';
import foodIcon from './icons/cutlery.svg';

export default function MapLegend() {
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <>
      <Popover placement="bottom-start" isOpen={isOpen}>
        <PopoverTrigger>
          <Button
            onClick={onToggle}
            style={{
              position: 'absolute',
              right: 110,
              top: 10,
              zIndex: 1000,
              width: 90,
            }}
            colorScheme="yellow"
            p="2"
            color="white"
            bg="yellow.500"
            _hover={{ bg: '#D99A00' }}
            _active={{ bg: '#D99A00' }}
            display="flex"
            flexDirection="column"
          >
            Map Legend
          </Button>
        </PopoverTrigger>

        <PopoverContent color="black" bg="white" borderColor="darkgrey" borderWidth={2} borderRadius={4} width={230}>
          <PopoverCloseButton borderColor="darkgrey" borderWidth={2} onClick={onClose} />
          <PopoverArrow bg="white" borderColor="darkgrey" />
          <PopoverBody bg="white">
            <HStack>
              <Square size="3" bg="magenta" opacity={0.3} borderWidth={1} borderColor={'black'} />
              <Text fontSize={'md'}>End Room</Text>
            </HStack>

            <HStack>
              <Square size="3" bg="green" opacity={0.3} borderWidth={1} borderColor={'black'} />
              <Text fontSize={'md'}>Completed Steps</Text>
            </HStack>

            <HStack>
              <Square size="3" bg="yellow" opacity={0.3} borderWidth={1} borderColor={'black'} />
              <Text fontSize={'md'}>Incomplete Steps</Text>
            </HStack>

            <HStack>
              <img src={pinIcon} />
              <Text fontSize={'md'}>End Room</Text>
            </HStack>

            <HStack>
              <img src={elevatorIcon} />
              <Text fontSize={'md'}>Elevators</Text>
            </HStack>

            <HStack>
              <img src={stairsIcon} />
              <Text fontSize={'md'}>Stairs</Text>
            </HStack>

            <HStack>
              <img src={foodIcon} />
              <Text fontSize={'md'}>Food Services</Text>
            </HStack>

            <HStack>
              <img src={mensRoomIcon} />
              <Text fontSize={'md'}>Mens Washrooms</Text>
            </HStack>

            <HStack>
              <img src={womensRoomIcon} />
              <Text fontSize={'md'}>Womens Washrooms</Text>
            </HStack>

            <HStack>
              <img src={neutralWashroomIcon} />
              <Text fontSize={'md'}>Gender Neutral Washrooms</Text>
            </HStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}
