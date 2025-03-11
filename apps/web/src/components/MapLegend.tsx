import {Button, HStack, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Square, Text, VStack } from "@chakra-ui/react";

export default function MapLegend() {
    return(
        <>
            <Popover placement='bottom-start' >
                <PopoverTrigger >
                    <Button  style={{
                        position: 'absolute',
                        right: 10,
                        top: 10,
                        zIndex: 1000
                        }}
                        colorScheme="purple"
                        p="2"
                        color="white"
                        bg="purple.500"
                        _hover={{ bg: '#67487d' }}
                        _active={{ bg: '#67487d' }}
                        display="flex"
                        flexDirection="column"
                    >
                        Legend
                    </Button>
                </PopoverTrigger>

                <PopoverContent color="black" bg="white" borderColor="darkgrey" borderWidth={2} borderRadius={4} width={180}>
                    <PopoverCloseButton borderColor="darkgrey" borderWidth={2}/>
                    <PopoverArrow bg='white' borderColor="darkgrey"/>
                    <PopoverBody>
                        <HStack >
                            <Square size="3" bg='#d500ff'/>
                            <Text fontSize={'md'}  >End Room</Text>
                        </HStack>

                        {/* <HStack>
                            <Square size="3" bg="red"/>
                            <Text fontSize={'md'}  >Current Room</Text>
                        </HStack> */}

                        <HStack>
                            <Square size="3" bg="#00b32c" border="black"/>
                            <Text fontSize={'md'}  >Completed Steps</Text>
                        </HStack>

                        <HStack>
                            <Square size="3" bg="red"/>
                            <Text fontSize={'md'} >Incomplete Steps</Text>
                        </HStack>
                    </PopoverBody>
                </PopoverContent>

            </Popover>
        </>
    )
}