import {Button, HStack, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Square, Text, VStack } from "@chakra-ui/react";

export default function MapTutorial() {
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
                        Tutorial
                    </Button>
                </PopoverTrigger>

                <PopoverContent color="black" bg="white" borderColor="darkgrey" borderWidth={2} borderRadius={4} width={180}>
                    <PopoverCloseButton borderColor="darkgrey" borderWidth={2}/>
                    <PopoverArrow bg='white' borderColor="darkgrey"/>
                    <PopoverBody>
                        
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </>
    )
}