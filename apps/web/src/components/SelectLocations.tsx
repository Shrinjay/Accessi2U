import React, { useCallback } from 'react';
import Select from 'react-select';
import rooms from '../../../ingest/data/rooms_partial.json';
import { Button, Checkbox, VStack, Text, Box, Flex, Heading, Image, Spacer, HStack } from '@chakra-ui/react';
import locationIcon from "/src/components/icon.svg";
import { theme } from '../../../styles/theme';

export default function SelectLocations() {
  const [options, setOptions] = React.useState([]);
  const [startPoint, setStart] = React.useState(null);
  const [endPoint, setEnd] = React.useState(null);
  const [completedInfo, setCompleted] = React.useState(false);
  const [accessible, setAccessible] = React.useState(false);
  const [indoors, setIndoors] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // https://stackoverflow.com/questions/73412077/how-to-use-json-data-for-react-select
  React.useEffect(() => {
    const getOptions = async () => {
      try {
        setIsLoading(true);
        setOptions(
          rooms['features'].map(({ properties }) => ({
            floor_Name: properties.FL_NM,
            building: properties.alt_bl_id,
            department: properties.Departments_name,
            room_type: properties.USE_TYPE,
            Text: properties.RM_NM,
            value: properties.RM_NM,
          })),
        );
        setIsLoading(false);
      } catch (error) {
        setOptions([{ Text: 'ERROR', value: 'ERROR' }]);
      }
    };
    getOptions();
  }, []);

  React.useEffect(() => {
    if (startPoint != null && endPoint != null) {
      setCompleted(true);
    } else {
      setCompleted(false);
    }
  }, [startPoint, endPoint]);

  const pathSelected = () => {
    setIsLoading(true);
  };


  return (
    <Flex height="100vh" width="100vw" bg="gray.100">
      {/* Left Panel */}
      <Box
        width="30%"
        p="6"
        bg="white"
        boxShadow="lg"
        display="flex"
        flexDirection="column"
      >
        <VStack spacing={4} height="100%" width="100%" align="stretch">
          <HStack spacing={2} align="center" justify="center">
            <Heading size="xl" fontSize={'3xl'} textAlign="center" mt="30px"  >Where are you located?</Heading>
            <Image src={locationIcon} alt="Location Icon" boxSize="40px" mt="20px" />
          </HStack>

          <VStack spacing={5} width="100%" flex={1} align="stretch">
            <Box width="100%" >
              <Text fontSize={'2xl'} fontWeight="bold" mb={2} mt="20px"  >Your Location</Text>
              <Select
                styles={theme}
                isClearable
                isDisabled={isLoading}
                value={startPoint}
                options={options}
                onChange={setStart}
                placeholder="E7 4003"


              />

              <Text fontSize={'2xl'} fontWeight="bold" mb={2} mt="30px" >Final Location</Text>
              <Select
                styles={theme}
                isClearable
                isDisabled={isLoading}
                value={endPoint}
                options={options}
                onChange={setEnd}
                placeholder="E7 5003"
              />
            </Box>
            <VStack spacing={2} align="flex-start" width="100%">
              <Text fontSize={['2xl']} fontWeight="bold" mb={2} color="brand.500" mt="10px" > Select your Preferences</Text>

              <HStack>
                <Checkbox isChecked={indoors} onChange={(e) => setIndoors(e.target.checked)} />
                <Text fontSize={['md']} mt="5px" fontFamily="body">Indoor only</Text>
              </HStack>
              <HStack>
                <Checkbox isChecked={accessible} onChange={(e) => setAccessible(e.target.checked)} />
                <Text fontSize={['md']} mt="5px" fontFamily="body">Elevator only</Text>
              </HStack>
              <HStack>
                <Checkbox />
                <Text fontSize={['md']} mt="5px" fontFamily="body">Hands-free</Text>
              </HStack>
            </VStack>

            <Button
              size="md"
              colorScheme="yellow"
              bg="yellow.500"
              fontSize="14px"
              _hover={{ bg: "#D99A00" }}
              _active={{ bg: "#C78C00" }}
              fontWeight="bold"
              borderRadius="6px"
              px="12px"
            >
              Save
            </Button>
            <VStack spacing={4} width="100%" align="center">
              <Box height="200px" /> {/* Adjust this value to control spacing */}
              <Button
                size="lg"
                colorScheme="brand"
                bg="#4D2161"
                color="white"
                fontSize="18px"
                py={4}
                borderRadius="8px"
                fontWeight="bold"
                isDisabled={!completedInfo}
                onClick={pathSelected}
              >
                Confirm Route
              </Button>

            </VStack>
          </VStack>


        </VStack>
      </Box>

      {/* Right Panel (Map Area) */}
      {/* Add your map component here */}
    </Flex>
  );
}