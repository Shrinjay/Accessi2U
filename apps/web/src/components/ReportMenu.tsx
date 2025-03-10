import {
  Button,
  Text,
  Box,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { theme } from '../styles';
import { useSubmitReport } from '../hooks/useSubmitReport';
import { RoomViewModel, useRooms } from '../hooks/useRooms';
// I hate this as much as you do
// https://github.com/prisma/prisma/issues/21474
import { $Enums } from 'database';

type Props = {
  selectedRoom: RoomViewModel;
  onClose: () => void;
};

export default function ReportMenu({ selectedRoom, onClose }: Props) {
  const { reportTypes, isLoadingReportTypes, submitReport, isSubmitting, error } = useSubmitReport(selectedRoom.id);
  const [errorType, setErrorType] = useState(null);
  const [valuesConfirmed, setValuesConfirmed] = useState(false);
  const [comments, setComments] = useState('');
  const accessibilityMap = { Y: 'True', N: 'False' };

  const toast = useToast();

  const prettyPrintReportType = (reportType: $Enums.ReportTypeEnum) => {
    switch (reportType) {
      case $Enums.ReportTypeEnum.MISLABELED:
        return 'Mislabelled';
      case $Enums.ReportTypeEnum.UNDER_MAINTENANCE:
        return 'Under Maintenance';
      case $Enums.ReportTypeEnum.OTHER:
        return 'Other';
      case $Enums.ReportTypeEnum.ELEVATOR_OUT_OF_SERVICE:
        return 'Elevator Out of Service';
      case $Enums.ReportTypeEnum.BATHROOM_NOT_ACCESSIBLE:
        return 'Bathroom Not Accessible';
      default:
        return reportType;
    }
  };

  useEffect(() => {
    if (selectedRoom != null && errorType != null) {
      setValuesConfirmed(true);
    } else {
      setValuesConfirmed(false);
    }
  }, [selectedRoom, errorType]);

  const handleChange = (event) => setComments(event.target.value);

  const handleSubmit = async () => {
    if (!valuesConfirmed) return;

    try {
      await submitReport({
        roomId: selectedRoom.id,
        reportType: errorType.value,
        comment: comments,
      });

      toast({
        title: 'Report submitted',
        description: 'Thank you for your feedback!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose(); // Close modal on successful submission
    } catch (err) {
      console.error('Error submitting report:', err);
    }
  };
  return (
    <>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Report an Issue</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {selectedRoom ? (
            <Box
              key={selectedRoom.id}
              bg="white"
              boxShadow="sm"
              display="flex"
              flexDirection="column"
              my="-1"
              alignItems="left"
            >
              <Text fontSize="md" fontWeight="bold">
                Room Selected
              </Text>
              <Select
                styles={theme}
                isClearable
                isDisabled
                value={{ value: selectedRoom.id, label: selectedRoom.name }}
                options={[{ value: selectedRoom.id, label: selectedRoom.name }]}
              />
              <Text fontSize="sm" fontWeight="normal" mt="1">
                Room Type: {selectedRoom.roomType}
              </Text>
              <Text fontSize="sm" fontWeight="normal">
                Department: {selectedRoom.geoJson.properties.Departments_name}
              </Text>
              <Text fontSize="sm" fontWeight="normal">
                Accessible: {accessibilityMap[selectedRoom.geoJson.properties.brg_accessible]}
              </Text>
              <Text fontSize="md" fontWeight="bold" mt="5px">
                Error Type
              </Text>
              <Select
                styles={theme}
                isClearable
                isDisabled={isSubmitting || isLoadingReportTypes}
                value={errorType}
                onChange={setErrorType}
                placeholder="Error Type"
                options={reportTypes?.map((type) => ({ value: type, label: prettyPrintReportType(type) })) || []}
              />

              <Text fontSize="md" fontWeight="bold" mt="5px">
                Aditional Comments
              </Text>
              <Input
                style={theme}
                isDisabled={isSubmitting}
                placeholder="Comments"
                value={comments}
                onChange={handleChange}
                mb="5"
              />

              {/* TODO: Add error message indicating what is necessary to fill in */}
              <Button
                onClick={handleSubmit}
                disabled={!valuesConfirmed}
                alignSelf="center"
                mb="2"
                width="100%"
                colorScheme="yellow"
                bg="yellow.500"
                fontSize="16px"
                _hover={{ bg: '#D99A00' }}
                _active={{ bg: '#C78C00' }}
                fontWeight="bold"
                borderRadius="6px"
                px="6px"
              >
                Submit
              </Button>
            </Box>
          ) : (
            <Spinner />
          )}
        </ModalBody>
      </ModalContent>
    </>
  );
}
