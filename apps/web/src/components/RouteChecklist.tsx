import React from "react";
import { Checkbox, StackDivider, Heading, Stack, Box, HStack, Text, Button, 
} from "@chakra-ui/react"
import { theme } from "../styles";

export default function RouteChecklist({roomList, checkedIndex, setCheckedIndex}) {
    const [fullRoomData, setFullRoomData] = React.useState(roomList);


    React.useEffect(() => {
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
                        mb="2" width="100%"
                        colorScheme="yellow"
                        bg="yellow.500"
                        fontSize="14px"
                        _hover={{ bg: "#D99A00" }}
                        _active={{ bg: "#C78C00" }}
                        fontWeight="bold"
                        borderRadius="6px"
                        px="6px">
                            Route Completed
                    </Button>
            </Stack>
        </>
    )
}