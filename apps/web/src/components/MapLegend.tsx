import {Button, HStack, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Square, Text } from "@chakra-ui/react";

export default function MapLegend() {
    return(
        <>
            <Popover placement='bottom-start'>
                <PopoverTrigger >
                    <Button style={{
                        position: 'absolute',
                        right: 10,
                        top: 10,
                        zIndex: 1000
                        }}
                        p="2"
                        color="black"
                        bg="white"
                        _hover={{ bg: "#DDDDDD" }}
                        _active={{ bg: "#DDDDDD" }}
                        display="flex"
                        flexDirection="column"
                        borderRadius={4}
                        borderColor={"darkgrey"}
                        borderWidth={2}
                        >
                        Legend
                    </Button>
                </PopoverTrigger>
                <PopoverContent color="black" bg="white" borderColor="darkgrey" borderWidth={2} borderRadius={4} width={180}>
                    <PopoverCloseButton borderColor="darkgrey" borderWidth={2}/>
                    <PopoverArrow bg='white' borderColor="darkgrey"/>
                    <PopoverBody>
                        <HStack>
                            <Square size="3" bg="#B38BC0"/>
                            <Text fontSize={'md'}  >Start/End Room</Text>
                        </HStack>

                        <HStack>
                            <Square size="3" bg="#88AF96"/>
                            <Text fontSize={'md'}  >Current Room</Text>
                        </HStack>

                        <HStack>
                            <Square size="3" bg="#8899B8"/>
                            <Text fontSize={'md'}  >Completed Steps</Text>
                        </HStack>

                        <HStack>
                            <Square size="3" bg="#BBBE8D"/>
                            <Text fontSize={'md'} >Incomplete Steps</Text>
                        </HStack>
                    </PopoverBody>
                </PopoverContent>

            </Popover>
        </>
    )
}