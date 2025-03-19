import { formatDistanceToNow } from 'date-fns';
import { useGetReports } from '../hooks/useGetReports.js';
import {
  Text,
  Box,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Divider,
} from '@chakra-ui/react';

// Optional helper to limit comment to 100 words:
function limitWords(str: string, maxWords: number) {
  const words = str.trim().split(/\s+/);
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...';
  }
  return str;
}

export function ReportsSummary({ roomId }: { roomId: number }) {
  const { reports, isLoadingReports } = useGetReports(roomId);
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (isLoadingReports) {
    return <div>Loading...</div>;
  }

  if (!reports || reports.length === 0) {
    return <div>No reports</div>;
  }

  // This block aggregates each "reportType" -> count & latest
  const reportTypeMap = reports.reduce((acc, report) => {
    if (report.reportType) {
      if (!acc[report.reportType]) {
        acc[report.reportType] = {
          count: 1,
          latest: new Date(report.updated_at || report.created_at || ''),
        };
      } else {
        acc[report.reportType].count += 1;
        const currentDate = new Date(report.updated_at || report.created_at || '');
        if (currentDate > acc[report.reportType].latest) {
          acc[report.reportType].latest = currentDate;
        }
      }
    }
    return acc;
  }, {} as Record<string, { count: number; latest: Date }>);

  return (
    <Box>
      {/* Show summary of aggregated reports */}
      {Object.entries(reportTypeMap).map(([type, { count, latest }]) => (
        <Box key={type} mb={1} lineHeight="shorter">
          <Text fontSize="sm" fontWeight="normal" m={0}>
            <strong>{type.charAt(0).toUpperCase() + type.slice(1).toLowerCase().replace('_', ' ')}</strong>: {count} report
            {count > 1 ? 's' : ''}
          </Text>
          <Text fontSize="xs" color="gray.500" m={0}>
            {formatDistanceToNow(latest, { addSuffix: true })}
          </Text>
        </Box>
      ))}

      {/* "See Reports" button shown only if reports exist */}
      {reports.length > 0 && (
        <Button
          onClick={onOpen}
          size="xs"
          mt={1}
          colorScheme="blue"
          variant="link"
        >
          See Reports
        </Button>
      )}

      {/* Modal with full timeline of reports */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent maxW={{ base: '95%', md: '600px' }}>
          <ModalHeader>All Reports</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {reports.map((report) => (
              <Box key={report.id} mb={3}>
                <Text fontWeight="bold" fontSize="sm">
                  {report.reportType}
                </Text>
                {report.comment && (
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    {limitWords(report.comment, 100)}
                  </Text>
                )}
                <Text fontSize="xs" color="gray.500">
                  Reported {formatDistanceToNow(new Date(report.updated_at || report.created_at))} ago
                </Text>
                <Divider my={2} />
              </Box>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} size="sm" colorScheme="blue">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
