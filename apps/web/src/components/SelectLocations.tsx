import { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { Button, Checkbox, VStack, Text, Box, Flex, Heading,
   Image, Spacer, HStack, useToast, Divider,
  Accordion, AccordionButton, AccordionItem, AccordionIcon, AccordionPanel,
  Tabs, TabList, TabPanels, TabPanel, Tab } from '@chakra-ui/react';
import locationIcon from '/src/components/icon.svg';
import { theme } from '../styles';
import PathMap from './PathMap';
import { trpc } from '../trpc';
import { usePath } from '../hooks/usePath';
import { buildErrorMessage } from 'vite';
import { GeolocationService } from '../services/geolocation';
import MapLegend from './MapLegend';
import MapTutorial from './MapTutorial';
import Pseudonyms from '../../../ingest/data/Eng_Pseudonyms.json';
import { roomByName } from '../../../server/src/procedures/room';
import { useRooms } from '../hooks/useRooms';

export default function SelectLocations() {
  const [startPoint, setStart] = useState(null);
  const [endPoint, setEnd] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [completedInfo, setCompleted] = useState(false);
  const [accessible, setAccessible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);

  const toast = useToast();

  const { data: rooms, isLoading: isListingRooms } = trpc.listRooms.useQuery();
  const { data: floors, isLoading: isListingFloors} = trpc.listFloors.useQuery();
  const { rooms: startRooms, isLoading: isLoadingStartRoom } = useRooms(
    {
      roomIds: startPoint?.value ? [startPoint.value] : [],
    },
    !!startPoint?.value,
  );
  const { roomsAlongPath, submit, isLoading: isGeneratingPath } = usePath(startPoint?.value, endPoint?.value);
  const options = useMemo(() => {
    return (
      rooms?.map((room) => ({
        value: room.id,
        label: `${room.name} ${Pseudonyms[room.name] ? `(${Pseudonyms[room.name]})` : ''} ${room.node?.length ? '' : ' [Unavailable]'}`,
        isDisabled: !room.node?.length,
      })) || []
    );
  }, [rooms]);

  const floorOptions = useMemo(() => {
    return(
      floors?.map((floor) => ({
        value: floor.id,
        label: floor.name
      })) || []
    );
  }, [floors]);

  useEffect(() => {
    if (startPoint != null && endPoint != null) {
      setCompleted(true);
    }
  }, [startPoint, endPoint]);

  const pathSelected = async () => {
    setIsLoading(true);
    const geolocaitonService = new GeolocationService();
    geolocaitonService.requestPermissions();
    try {
      await submit(accessible);
      setMenuOpen(false);
    } catch (e) {
      console.error(e);
      toast({
        title: 'Error',
        description: `An error occurred while fetching the path ${e.message}`,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const changeMenuVisibility = () => {
    setMenuOpen(!menuOpen);
  };

  const pathReset = () => {
    setStart(null);
    setEnd(null);
    setMenuOpen(true);
  };

  return (
    <Flex height="100vh" width="100vw" bg="gray.100">
      {/* Left Panel */}
      <MapLegend />
      <MapTutorial />


      {menuOpen ? (
        <>
          <Box
            p="6"
            bg="white"
            boxShadow="lg"
            flexDirection="column"
            sx={{
              left: 0,
              zIndex: 1001,
              width: { xs: '100%', md: '50%', lg: '30%' },
            }}
          >
            <Tabs isFitted variant={"enclosed"} colorScheme='purple'>
              <TabList>
                <Tab>Find Route</Tab>
                <Tab>Map View</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                <Heading fontSize={'3xl'} mt="10px" mb="10px" mr={2}>
                    Select Route Start/End
                </Heading>
                <Box width="100%">
                      <Text fontSize={'2xl'} fontWeight="bold" mb={2} mt="20px">
                        Your Location
                      </Text>
                      <Select
                        styles={theme}
                        isClearable
                        isDisabled={isLoading}
                        value={startPoint}
                        options={options}
                        isOptionDisabled={(option) => option.isDisabled}
                        onChange={setStart}
                        placeholder="DWE 1431"
                        aria-errormessage="*Required"
                        aria-invalid={true}
                      />
                      <Text fontSize="xs" fontWeight="thin" mt={0} ml={2}>
                        *Required
                      </Text>

                      <Text fontSize={'2xl'} fontWeight="bold" mb={2} mt="30px">
                        Final Location
                      </Text>
                      <Select
                        styles={theme}
                        isClearable
                        isDisabled={isLoading}
                        isOptionDisabled={(option) => option.isDisabled}
                        value={endPoint}
                        options={options}
                        onChange={setEnd}
                        placeholder="DWE 1432"
                      />
                      <Text fontSize="xs" fontWeight="thin" mt={0} ml={2}>
                        *Required
                      </Text>

                      <Text fontSize={['2xl']} fontWeight="bold" mb={2} color="brand.500" mt="10px">
                        {' '}
                        Select your Preferences
                      </Text>

                      <HStack>
                        <Checkbox isChecked={accessible} onChange={(e) => setAccessible(e.target.checked)} />
                        <Text fontSize={['md']} mt="5px" fontFamily="body">
                          Elevator only
                        </Text>
                      </HStack>

                      <Button
                        size="lg"
                        colorScheme="brand"
                        bg="purple.500"
                        color="white"
                        fontSize="18px"
                        py={4}
                        borderRadius="8px"
                        fontWeight="bold"
                        isDisabled={!completedInfo || isGeneratingPath}
                        onClick={pathSelected}
                        isLoading={isGeneratingPath}
                        mt={6}
                        _hover={{ bg: '#4D2161' }}
                        _active={{ bg: '#4D2161' }}
                      >
                        Confirm Route
                      </Button>
                    </Box>
                </TabPanel>
                <TabPanel>
                <Heading fontSize={'3xl'} mt="10px" mb="10px" mr={2}>
                    Select Floor
                </Heading>
                <Select
                      styles={theme}
                      isClearable
                      isDisabled={isLoading}
                      value={selectedFloor}
                      options={floorOptions}
                      onChange={setSelectedFloor}
                      placeholder="DWE_01"
                    />
                    <Text fontSize="xs" fontWeight="thin" mt={0} ml={2}>
                        *Required
                    </Text>

                    <Button
                      size="lg"
                      colorScheme="brand"
                      bg="purple.500"
                      color="white"
                      fontSize="18px"
                      py={4}
                      borderRadius="8px"
                      fontWeight="bold"
                      mt={6}
                      isDisabled={selectedFloor == null}
                      onClick={() => setMenuOpen(false)}
                      isLoading={isGeneratingPath}
                      _hover={{ bg: '#4D2161' }}
                      _active={{ bg: '#4D2161' }}
                    >
                      View Floor
                    </Button>
                </TabPanel>
              </TabPanels>
            </Tabs>
                  {/* TODO: Lol maybe one day */}
                  {/* <HStack>
                    <Checkbox isChecked={indoors} onChange={(e) => setIndoors(e.target.checked)} />
                    <Text fontSize={['md']} mt="5px" fontFamily="body">
                      Indoor only
                    </Text>
                  </HStack> */}

                  {/* TODO: LMFAO probably never */}
                  {/* <HStack>
                    <Checkbox />
                    <Text fontSize={['md']} mt="5px" fontFamily="body">
                      Hands-free
                    </Text>
                  </HStack> */}

                {/* TODO: Maybe with cookies, unlikely*/}
                {/* <Button
                  size="md"
                  colorScheme="yellow"
                  bg="yellow.500"
                  fontSize="14px"
                  _hover={{ bg: '#D99A00' }}
                  _active={{ bg: '#C78C00' }}
                  fontWeight="bold"
                  borderRadius="6px"
                  px="12px"
                >
                  Save
                </Button> */}
          </Box>
        </>
      ) : (
        <>
          <Button
            style={{
              position: 'absolute',
              left: 50,
              top: 10,
              zIndex: 1000,
              width: 145,
            }}
            colorScheme="purple"
            p="2"
            color="white"
            bg="purple.500"
            _hover={{ bg: '#4D2161' }}
            _active={{ bg: '#4D2161' }}
            display="flex"
            flexDirection="column"
            onClick={changeMenuVisibility}
          >
            Open Route Select
          </Button>
        </>
      )}

      {/* Right Panel (Map Area) */}
      <PathMap
        startRoom={startRooms?.[0]}
        roomsAlongPath={roomsAlongPath}
        menuOpen={menuOpen}
        isLoading={isGeneratingPath || isListingRooms || isLoadingStartRoom}
        changeMenuVisibility={changeMenuVisibility}
        resetRoute={pathReset}
        chosenFloor={selectedFloor?selectedFloor : null}
      />
      {/* Add your map component here */}
    </Flex>
  );
}
