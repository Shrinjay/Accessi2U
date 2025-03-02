import { useEffect, useState } from "react";
import { Checkbox, StackDivider, Heading, Stack, Box, HStack, Text, Button, 
    useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, 
    ModalBody, 
} from "@chakra-ui/react"
import { theme } from "../styles";

export default function RouteChecklist({roomList, checkedIndex, setCheckedIndex}) {
    const [fullRoomData, setFullRoomData] = useState(roomList);
    const {isOpen, onOpen, onClose} = useDisclosure()


    useEffect(() => {
        const setData = async () => {
            const newRooms = []
            for (let i=0; i < roomList.length; i++){
                const newDict = 
                {index: i,
                roomName: roomList[i],
                instructions: "Go to this location next"
                }
                newRooms.push(newDict);
            }
            setFullRoomData(newRooms);
        }
        setData();
    }, [])

    const handleCheck = (event) => {
        if (event.target.checked) {
            setCheckedIndex(event.target.value)
        } else {
            setCheckedIndex(event.target.value - 1)
        }
    }

    return (
        <>
            <Stack divider={<StackDivider/>} spacing='3'>
                {fullRoomData.map((room) => 
                <Box key={room} style={theme}>
                    <HStack>
                        <Heading size = 'sm' textTransform='uppercase'>
                            {room.roomName}
                        </Heading>

                        <Checkbox 
                                    value={room.index} size='md'
                                    isChecked={room.index <= checkedIndex}
                                    onChange={handleCheck}>
                        </Checkbox>
                    </HStack>

                    <Text>
                        {room.instructions}
                    </Text>

                </Box>)}
                <Button 
                        alignSelf="center" 
                        mb="2" size="lg"
                        colorScheme="yellow"
                        bg="yellow.500"
                        fontSize="20px"
                        _hover={{ bg: "#D99A00" }}
                        _active={{ bg: "#C78C00" }}
                        fontWeight="bold"
                        borderRadius="6px"
                        px="6px"
                        onClick={onOpen}>
                            Route Completed
                    </Button>
            </Stack>

            <Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={true}>
                    <ModalOverlay>
                        <ModalContent>
                            <ModalHeader ml={2}>Confirm Exit</ModalHeader>
                            <ModalCloseButton/>
                            <ModalBody>
                                <Box
                                    bg="white"
                                    boxShadow="sm"
                                    display="flex"
                                    flexDirection="column"
                                    my="-1"
                                    alignItems="left"
                                    padding={2}>
                                        <Text fontSize="md" mb={2} mt={-1}>
                                            Clicking "Confirm" will exit the current route and return to route select screen. Click "Cancel" to return to the current route.
                                        </Text>
                                    
                                    <HStack align="center" spacing={5}>
                                        <Button 
                                            alignSelf="center" 
                                            mt="2" size="md"
                                            colorScheme="yellow"
                                            bg="yellow.500"
                                            fontSize="20px"
                                            _hover={{ bg: "#D99A00" }}
                                            _active={{ bg: "#C78C00" }}
                                            fontWeight="bold"
                                            borderRadius="6px"
                                            px="6px">
                                                Confirm
                                        </Button>
                                        <Button 
                                            alignSelf="center" 
                                            mt="2" size="md"
                                            colorScheme="purple"
                                            bg="purple.500"
                                            fontSize="20px"
                                            _hover={{ bg: "#67487d" }}
                                            _active={{ bg: "#67487d" }}
                                            fontWeight="bold"
                                            borderRadius="6px"
                                            px="6px"
                                            onClick={onClose}>
                                                Cancel
                                        </Button>
                                    </HStack>
                                </Box>
                            </ModalBody>
                        </ModalContent>
                    </ModalOverlay>
            </Modal>
        </>
    )
}