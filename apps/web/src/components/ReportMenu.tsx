import { Button, Text, Box, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Input} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import rooms from "../../../ingest/data/rooms_partial.json";
import Select from 'react-select';
import { theme } from "../styles";

export default function ReportMenu({passedRoom, onClose, defaultRoom}) {
      const [options, setOptions] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
      const [selectedRoom, setSelectedRoom] = useState(null)
      const [fullRoomData, setFullRoomData] = useState(passedRoom);
      const [errorType, setErrorType] = useState(null);
      const [valuesConfirmed, setValuesConfirmed] = useState(false);
      const [comments, setComments] = useState("");
      const accessibilityMap = {"Y": "True", "N": "False"}

      // https://stackoverflow.com/questions/73412077/how-to-use-json-data-for-react-select
      useEffect(() => {
        const getOptions = async () => {
          try {
            setIsLoading(true);
            setOptions(
              rooms['features'].map(({ properties }) => ({
                // floor_Name: properties.FL_NM,
                // building: properties.alt_bl_id,
                // department: properties.Departments_name,
                // room_type: properties.USE_TYPE,
                label: properties.RM_NM,
                value: properties.RM_NM,
              })),
            );
            setIsLoading(false);

            setSelectedRoom(defaultRoom)
          } catch (error) {
            setOptions([{ Text: 'ERROR', value: 'ERROR' }]);
          }
        };
        getOptions();
      }, []);

      useEffect(() => {
        if ((selectedRoom != null) && (errorType != null)) {
            setValuesConfirmed(true);
        } else {
            setValuesConfirmed(false);
        }
      }, [selectedRoom, errorType]);

      const handleChange = (event) => setComments(event.target.value)

    return(
        <>
            <ModalOverlay/>
                <ModalContent>
                <ModalHeader>Report an Issue</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Box key={fullRoomData}
                    bg="white"
                    boxShadow="sm"
                    display="flex"
                    flexDirection="column"
                    my="-1"
                    alignItems="left">
                        <Text fontSize="md" fontWeight="bold">Room Selected</Text>
                        <Select
                            styles={theme}
                            isClearable
                            isDisabled={isLoading}
                            value={selectedRoom}
                            options={options}
                            onChange={setSelectedRoom}
                        />
                        {(fullRoomData != null) ? <>
                          <Text fontSize="sm" fontWeight="normal" mt="1">
                              Room Type: {fullRoomData.properties.rm_standard}</Text>
                          <Text fontSize='sm' fontWeight="normal">
                              Department: {fullRoomData.properties.Departments_name}</Text>
                          <Text fontSize='sm' fontWeight="normal">
                              Accessible: {accessibilityMap[fullRoomData.properties.brg_accessible]}</Text>
                        </> : <>
                        </>}
                        

                        <Text fontSize="md" fontWeight="bold"  mt="5px">Error Type</Text>
                        <Select
                            styles={theme}
                            isClearable
                            isDisabled={isLoading}
                            value={errorType}
                            onChange={setErrorType}
                            placeholder="Error Type"
                            options={[{value: "Mislabelled", label:"Mislabelled"}, {value: "Maintenance", label: "Maintenance"}]}
                        />

                        <Text fontSize="md" fontWeight="bold" mt="5px" >Aditional Comments</Text>
                        <Input
                            style={theme}
                            isDisabled={isLoading}
                            placeholder="Comments"
                            value={comments}
                            onChange={handleChange}
                            mb="5"
                        />

                        {/* TODO: Add error message indicating what is necessary to fill in */}
                        <Button 
                        onClick={onClose} 
                        disabled={!valuesConfirmed} 
                        alignSelf="center" 
                        mb="2" width="100%"
                        colorScheme="yellow"
                        bg="yellow.500"
                        fontSize="16px"
                        _hover={{ bg: "#D99A00" }}
                        _active={{ bg: "#C78C00" }}
                        fontWeight="bold"
                        borderRadius="6px"
                        px="6px">
                            Submit
                        </Button>
                    </Box>
                </ModalBody>
            </ModalContent>
        </>
    )
}