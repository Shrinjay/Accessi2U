import {Button, HStack, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Square, Text, VStack } from "@chakra-ui/react";

export default function MapTutorial() {
    return(
        <>
            <Popover placement='bottom-end'>
                <PopoverTrigger >
                    <Button
                        style={{
                            position: 'absolute',
                            right: 10,
                            top: 10,
                            zIndex: 1000,
                            width: 90,
                            }}
                        colorScheme="yellow"
                        p="2"
                        color="white"
                        bg="yellow.500"
                        _hover={{ bg: '#D99A00' }}
                        _active={{ bg: '#D99A00' }}
                        display="flex"
                        flexDirection="column"
                    >
                        Tutorial
                    </Button>
                </PopoverTrigger>

                <PopoverContent color="black" bg="white" borderColor="darkgrey" borderWidth={2} borderRadius={4} width={250}>
                    <PopoverCloseButton borderColor="darkgrey" borderWidth={2}/>
                    <PopoverArrow bg='white' borderColor="darkgrey"/>
                    <PopoverBody>
                    <Text fontSize="md" fontWeight="bold">
                        Navigating
                    </Text>

                    <Text fontSize="sm">
                        1. Input start & end locations
                    </Text> 
                    <Text fontSize="sm">
                        2. Select "Confirm route"
                    </Text> 
                    <Text fontSize="sm">
                        3. View route on map
                    </Text>
                    <Text fontSize="sm">
                        4. Select arrow to view Steps
                    </Text> 
                    <Text fontSize="sm">
                        5. Check completed steps
                    </Text>
                    <Text fontSize="sm">
                        6. Complete route to return
                    </Text>

                    <Text fontSize="md" fontWeight="bold" mt={2}>
                        Reporting Issues
                    </Text>

                    <Text fontSize="sm">
                        1. Select any room on map
                    </Text> 
                    <Text fontSize="sm">
                        2. Select "Report Issue"
                    </Text> 
                    <Text fontSize="sm">
                        3. Select error type
                    </Text>
                    <Text fontSize="sm">
                        4. Type comments (if needed)
                    </Text> 
                    <Text fontSize="sm">
                        5. Select "Submit"
                    </Text>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </>
    )
}