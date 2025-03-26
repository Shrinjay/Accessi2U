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
  VStack,
} from '@chakra-ui/react';

export default function MapTutorial() {
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <>
      <Popover placement="bottom-end" isOpen={isOpen}>
        <PopoverTrigger>
          <Button
            onClick={onToggle}
            style={{
              position: 'absolute',
              right: 10,
              top: 30,
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
            Tutorial
          </Button>
        </PopoverTrigger>

        <PopoverContent color="black" bg="white" borderColor="darkgrey" borderWidth={2} borderRadius={4} width={250}>
          <PopoverCloseButton borderColor="darkgrey" borderWidth={2} onClick={onClose} />
          <PopoverArrow bg="white" borderColor="darkgrey" />
          <PopoverBody>
            <Text fontSize="md" fontWeight="bold">
              Navigating
            </Text>

            <Text fontSize="sm">1. Input your locationa and final location.</Text>
            <Text fontSize="sm">2. Click "Confirm route".</Text>
            <Text fontSize="sm">
              3. Your route will be displayed on the map and your next step will be displayed. See "Map Legend" for what
              each colour indicates.
            </Text>
            <Text fontSize="sm">4. Click the up arrow to view the steps on your route.</Text>
            <Text fontSize="sm">5. Check off completed steps.</Text>
            <Text fontSize="sm">6. Click "complete route" to finish your route.</Text>

            <Text fontSize="md" fontWeight="bold" mt={2}>
              Reporting Issues
            </Text>

            <Text fontSize="sm">1. Select any room on map</Text>
            <Text fontSize="sm">2. Select "Report Issue"</Text>
            <Text fontSize="sm">3. Select error type</Text>
            <Text fontSize="sm">4. Type comments (if needed)</Text>
            <Text fontSize="sm">5. Select "Submit"</Text>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}
