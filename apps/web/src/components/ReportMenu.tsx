import { Button, Heading, useDisclosure, Text, Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter} from "@chakra-ui/react";

export default function ReportMenu({selectedRoom, onClose}) {
    return(
        <>
            <ModalOverlay/>
                <ModalContent>
                <ModalHeader>Report an Issue</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    {selectedRoom}
                </ModalBody>
                <ModalFooter>
                    <Button>Submit</Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </>
    )
}