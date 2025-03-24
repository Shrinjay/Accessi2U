import { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { Button, Checkbox, VStack, Text, Box, Flex, Heading, Image, Spacer, HStack, useToast } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import locationIcon from '/src/components/icon.svg';
import { theme } from '../styles';
import PathMap from './PathMap';
import { trpc } from '../trpc';
import { usePath } from '../hooks/usePath';
import { buildErrorMessage } from 'vite';
import { GeolocationService } from '../services/geolocation';

export default function SelectLocations() {
  const [startPoint, setStart] = useState(null);
  const [endPoint, setEnd] = useState(null);
  const [completedInfo, setCompleted] = useState(false);
  const [accessible, setAccessible] = useState(false);
  const [indoors, setIndoors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const [errorMsg, setErrorMsg] = useState('Please Enter Your Location & Final Location');
  const [errorVisible, setErrorVisible] = useState(true);

  const toast = useToast();

  const { data: rooms, isLoading: isListingRooms } = trpc.listRooms.useQuery();
  const { roomsAlongPath, submit, isLoading: isGeneratingPath } = usePath(startPoint?.value, endPoint?.value);

  const options = useMemo(() => {
    return rooms?.map((room) => ({ value: room.id, label: room.name })) || [];
  }, [rooms]);

  useEffect(() => {
    if (startPoint != null && endPoint != null) {
      setCompleted(true);
      setErrorMsg('');
    } else {
      if (startPoint != null) {
        setErrorMsg('Please Enter Final Location');
      } else if (endPoint != null) {
        setErrorMsg('Please Enter Your Location');
      } else {
        setErrorMsg('Please Enter Your Location & Final Location');
      }
      setCompleted(false);
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

      {menuOpen ? (
        <>
          <Box
            p="6"
            bg="white"
            boxShadow="lg"
            display="flex"
            flexDirection="column"
            sx={{
              left: 0,
              zIndex: 1001,
              width: { xs: '100%', md: '50%', lg: '30%' },
            }}
          >
            <CloseIcon sx={{ right: 0 }} onClick={changeMenuVisibility} alignSelf={'flex-end'} />

            <VStack spacing={4} height="100%" width="100%" align="stretch">
              <HStack spacing={2} align="center" justify="center">
                <Heading size="xl" fontSize={'3xl'} textAlign="center" mt="30px">
                  Where are you located?
                </Heading>
                {/* <Image src={locationIcon} alt="Location Icon" boxSize="40px" mt="20px" /> */}
              </HStack>

              <VStack spacing={5} width="100%" flex={1} align="stretch">
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
                    value={endPoint}
                    options={options}
                    onChange={setEnd}
                    placeholder="DWE 1432"
                  />
                  <Text fontSize="xs" fontWeight="thin" mt={0} ml={2}>
                    *Required
                  </Text>
                </Box>
                <VStack spacing={2} align="flex-start" width="100%">
                  <Text fontSize={['2xl']} fontWeight="bold" mb={2} color="brand.500" mt="10px">
                    {' '}
                    Select your Preferences
                  </Text>

                  {/* TODO: Lol maybe one day */}
                  {/* <HStack>
                    <Checkbox isChecked={indoors} onChange={(e) => setIndoors(e.target.checked)} />
                    <Text fontSize={['md']} mt="5px" fontFamily="body">
                      Indoor only
                    </Text>
                  </HStack> */}
                  <HStack>
                    <Checkbox isChecked={accessible} onChange={(e) => setAccessible(e.target.checked)} />
                    <Text fontSize={['md']} mt="5px" fontFamily="body">
                      Elevator only
                    </Text>
                  </HStack>
                  {/* TODO: LMFAO probably never */}
                  {/* <HStack>
                    <Checkbox />
                    <Text fontSize={['md']} mt="5px" fontFamily="body">
                      Hands-free
                    </Text>
                  </HStack> */}
                </VStack>

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

                {/* <Text fontSize={['sm']} mb="-1" fontFamily="body" color="red">
                  {errorMsg}
                </Text> */}

                <Button
                  size="lg"
                  colorScheme="brand"
                  bg="#4D2161"
                  color="white"
                  fontSize="18px"
                  py={4}
                  borderRadius="8px"
                  fontWeight="bold"
                  isDisabled={!completedInfo || isGeneratingPath}
                  onClick={pathSelected}
                  isLoading={isGeneratingPath}
                  onMouseOver={() => setErrorVisible(true)}
                >
                  Confirm Route
                </Button>
              </VStack>
            </VStack>
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
            _hover={{ bg: '#67487d' }}
            _active={{ bg: '#67487d' }}
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
        roomsAlongPath={menuOpen ? [] : roomsAlongPath}
        menuOpen={menuOpen}
        isLoading={isGeneratingPath || isListingRooms}
        changeMenuVisibility={changeMenuVisibility}
        resetRoute={pathReset}
      />
      {/* Add your map component here */}
    </Flex>
  );
}
