import {HStack, Square, Text } from "@chakra-ui/react";

export default function MapLegend() {
    return(
        <>
            <Text fontSize={'l'} fontWeight="bold">Legend</Text>
            <HStack>
                <Square size="3" bg="#B38BC0"/>
                <Text fontSize={'md'}  >Start/End Room</Text>
            </HStack>

            <HStack>
                <Square size="3" bg="#88AF96"/>
                <Text fontSize={'md'}  >Elevators/Stairs</Text>
            </HStack>

            <HStack>
                <Square size="3" bg="#8899B8"/>
                <Text fontSize={'md'}  >Completed Steps</Text>
            </HStack>

            <HStack>
                <Square size="3" bg="#BBBE8D"/>
                <Text fontSize={'md'} >Incomplete Steps</Text>
            </HStack>
        </>
    )
}