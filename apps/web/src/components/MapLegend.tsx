import {Button, HStack, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, 
    PopoverContent, PopoverTrigger, Square, Text} from "@chakra-ui/react";
import currentLocationIcon from './icons/marker.svg';
import elevatorIcon from './icons/elevatorIcon.svg';
import stairsIcon from './icons/stairs.svg';
import pinIcon from './icons/pin.svg';
import mensRoomIcon from './icons/washroom-men.svg';
import womensRoomIcon from './icons/washroom-women.svg';
import neutralWashroomIcon from './icons/washroom-stall.svg';
import foodIcon from './icons/cutlery.svg';    

export default function MapLegend() {
    return(
        <>
            <Popover placement='bottom-start' >
                <PopoverTrigger >
                    <Button
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
                    <PopoverCloseButton borderColor="darkgrey" borderWidth={2}/>
                    <PopoverArrow bg='white' borderColor="darkgrey"/>
                    <PopoverBody>
                        <HStack >
                            <Square size="3" bg='magenta' borderWidth={1} borderColor={"black"}/>
                            <Text fontSize={'md'}  >End Room</Text>
                        </HStack>

                        <HStack>
                            <Square size="3" bg="green" borderWidth={1} borderColor={"black"}/>
                            <Text fontSize={'md'}  >Completed Steps</Text>
                        </HStack>

                        <HStack>
                            <Square size="3" bg="yellow" borderWidth={1} borderColor={"black"}/>
                            <Text fontSize={'md'} >Incomplete Steps</Text>
                        </HStack>

                        <HStack>
                            <img src={pinIcon}/>
                            <Text fontSize={'md'} >End Room</Text>
                        </HStack>

                        <HStack>
                            <img src={elevatorIcon}/>
                            <Text fontSize={'md'} >Elevators</Text>
                        </HStack>

                        <HStack>
                            <img src={stairsIcon}/>
                            <Text fontSize={'md'} >Stairs</Text>
                        </HStack>

                        <HStack>
                            <img src={foodIcon}/>
                            <Text fontSize={'md'} >Food Services</Text>
                        </HStack>

                        <HStack>
                            <img src={mensRoomIcon}/>
                            <Text fontSize={'md'} >Mens Washrooms</Text>
                        </HStack>

                        <HStack>
                            <img src={womensRoomIcon}/>
                            <Text fontSize={'md'} >Womens Washrooms</Text>
                        </HStack>

                        <HStack>
                            <img src={neutralWashroomIcon}/>
                            <Text fontSize={'md'} >Gender Neutral Washrooms</Text>
                        </HStack>
                    </PopoverBody>
                </PopoverContent>

            </Popover>
        </>
    )
}