import React from "react";
import { Checkbox, Drawer, DrawerHeader, DrawerBody, 
    StackDivider, Heading, Stack, Box, HStack, Text, 
    DrawerOverlay,
    DrawerCloseButton,
    DrawerContent, useDisclosure} from "@chakra-ui/react"

export default function RouteChecklist({roomList, checkedIndex, setCheckedIndex}) {
    const [fullRoomData, setFullRoomData] = React.useState(roomList);


    React.useEffect(() => {
        const setData = async () => {
            const newRooms = []
            for (let i=0; i < roomList.length; i++){
                const newDict = 
                {index: i,
                roomName: roomList[i],
                instructions: "Turn Left"
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
                <Box key={room}>
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
            </Stack>
        </>
    )
}